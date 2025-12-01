/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/scraper.ts
import * as cheerio from "cheerio";
import axios from "axios";

export class LexAOScraper {
  private baseUrl = "https://lex.ao";
  private userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

  /**
   * Faz scraping profundo do conteúdo de um documento.
   */
  async getDocumentDetails(url: string): Promise<string> {
    try {
      // Garantir que a URL é absoluta
      const targetUrl = url.startsWith('http') ? url : `${this.baseUrl}${url}`;

      const response = await axios.get(targetUrl, {
        headers: { "User-Agent": this.userAgent },
        timeout: 10000 // Timeout de 10s para não prender o WhatsApp
      });

      const html = response.data;
      const $ = cheerio.load(html);

      // Remover scripts, estilos e elementos desnecessários para limpar o texto
      $('script, style, nav, footer, header, .sidebar').remove();

      // Coleta título principal
      const title = $("h1").first().text().trim() || $("title").first().text().trim();

      // Coleta o conteúdo principal (tentativa de focar na área de texto)
      // Ajuste os seletores conforme a estrutura real do Lex.ao se necessário
      const contentContainer = $("article, .document-content, .entry-content, #main").first();
      
      // Se não achar container específico, pega do body, mas filtrado
      const target = contentContainer.length ? contentContainer : $("body");

      let cleanText = "";
      
      target.find("h1, h2, h3, h4, p, li").each((_, el) => {
        const text = $(el).text().trim();
        if (text.length > 10) { // Ignora textos muito curtos (links soltos, menus)
           cleanText += `${text}\n\n`;
        }
      });

      if (!cleanText) return "Conteúdo do documento não pôde ser extraído.";

      return `TÍTULO DO DOCUMENTO: ${title}\n\nCONTEÚDO EXTRAÍDO:\n${cleanText}`.trim();

    } catch (error) {
      console.error(`Erro ao extrair detalhes de ${url}:`, error);
      return ""; // Retorna vazio para não atrapalhar o prompt
    }
  }

  /**
   * Pesquisa lista de documentos.
   */
  async searchDocuments(query: string): Promise<any[]> {
    try {
      const searchUrl = new URL(`${this.baseUrl}/`);
      searchUrl.searchParams.set("s", query);

      const response = await axios.get(searchUrl.toString(), {
        headers: { "User-Agent": this.userAgent }
      });

      const $ = cheerio.load(response.data);
      const documents: any[] = [];

      $("article, .post, .result").each((_, element) => {
        const titleEl = $(element).find("h1, h2, h3, .entry-title a").first();
        const title = titleEl.text().trim();
        const link = titleEl.attr("href") || $(element).find("a").first().attr("href");
        const snippet = $(element).find("p, .entry-summary").text().trim();

        if (title && link) {
          documents.push({
            title,
            url: this.resolveUrl(link),
            snippet: snippet
          });
        }
      });

      // Retorna apenas os 3 mais relevantes para economizar processamento
      return documents.slice(0, 3);
    } catch (error) {
      console.error("Erro na busca:", error);
      return [];
    }
  }

  private resolveUrl(link: string): string {
    if (link.startsWith("http")) return link;
    return `${this.baseUrl}${link.startsWith('/') ? '' : '/'}${link}`;
  }
}