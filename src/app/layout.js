
import "./globals.css";

export const metadata = {
  title: "StudyHub | Student Resources",
  description: "Share and discover study resources.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
