import './globals.css';
import Providers from './providers';

export const metadata = {
  title: 'Team Task Manager',
  description: 'A full-stack team project and task manager',
};

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body>
        <div id='modal' />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
