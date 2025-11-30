// app/layout.tsx - ATUALIZADO
import './globals.css';

export const metadata = {
  title: 'NormAI - Assistente Jurídico Inteligente',
  description: 'Tecnologia jurídica especializada em legislação angolana',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt" suppressHydrationWarning>
      <body>
        
          {children}
        
      </body>
    </html>
  );
}