// import './styles/global.css'; 

// export const metadata = {
//   title: 'Health Influencer Verification',
//   description: 'Admin panel for health influencer verification',
// };

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <html lang="en">
//       <head>
//         <meta charSet="UTF-8" />
//         <meta name="viewport" content="width=device-width, initial-scale=1" />
//         <title>{metadata.title}</title>
//         <meta name="description" content={metadata.description} />
//       </head>
//       <body>{children}</body>
//     </html>
//   );
// }

import { ThemeProvider } from "next-themes"
import './styles/global.css'

export const metadata = {
  title: 'Health Influencer Verification',
  description: 'Admin panel for health influencer verification',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}