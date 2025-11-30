/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/scraper.ts
import * as cheerio from "cheerio";
import axios from "axios";

export class LexAOScraper {
  private baseUrl = "https://lex.ao";

  /**
   * Faz scraping de detalhes de um documento específico.
   */
  async getDocumentDetails(url: string): Promise<string> {
    try {
      const response = await axios.get(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        },
      });

      const html = response.data;
      const $ = cheerio.load(html);

      // Coleta títulos
      const title =
        $("h1").first().text().trim() ||
        $("title").first().text().trim() ||
        "Sem título";

      // Coleta headings
      const headings: string[] = [];
      $("h1, h2, h3").each((_, el) =>
        headings.push($(el).text().trim())
      );

      // Coleta parágrafos
      const paragraphs: string[] = [];
      $("p").each((_, el) =>
        paragraphs.push($(el).text().trim())
      );

      // Junta tudo em um texto único
      const fullText = `
TÍTULO: ${title}

CABEÇALHOS:
${headings.join("\n")}

CONTEÚDO:
${paragraphs.join("\n\n")}
      `.trim();

      return fullText || "Sem conteúdo extraído.";

    } catch (error) {
      console.error("Erro ao extrair detalhes do documento:", error);
      return "Erro ao acessar o documento.";
    }
  }

  /**
   * Pesquisa documentos no lex.ao com base em um termo.
   */
  async searchDocuments(query: string): Promise<any[]> {
    try {
      const searchUrl = new URL(`${this.baseUrl}/`);
      searchUrl.searchParams.set("s", query);

      const response = await fetch(searchUrl.toString(), {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const html = await response.text();
      const $ = cheerio.load(html);

      const documents: any[] = [];

      $("article, .post, .document").each((_, element) => {
        const title = $(element)
          .find("h1, h2, h3, .title")
          .first()
          .text()
          .trim();

        const link = $(element).find("a").first().attr("href");

        const snippet = $(element)
          .find("p, .excerpt, .summary")
          .first()
          .text()
          .trim();

        if (title) {
          documents.push({
            title,
            url: link ? this.resolveUrl(link) : "#",
            content: snippet || "Resumo não disponível",
            type: "", // você pode adicionar extração futura
            number: "",
            date: "",
          });
        }
      });

      return documents.slice(0, 5);
    } catch (error) {
      console.error("Erro ao buscar documentos:", error);
      return [];
    }
  }

  /**
   * Converte URLs relativas em absolutas.
   */
  private resolveUrl(link: string): string {
    if (link.startsWith("http")) return link;
    if (link.startsWith("/")) return `${this.baseUrl}${link}`;
    return `${this.baseUrl}/${link}`;
  }
}
