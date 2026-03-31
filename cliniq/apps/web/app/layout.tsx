import type { ReactNode } from "react";

export const metadata = {
  title: "ClinIQ",
  description: "ClinIQ — digital academic community for nursing and midwifery students in Ghana."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

