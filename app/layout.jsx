import "./globals.css";

export const metadata = {
  title: "movie",
  description: "영화소개 페이지",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}