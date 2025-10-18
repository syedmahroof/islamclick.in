import { PageProps as InertiaPageProps } from '@inertiajs/core';

declare global {
  interface Window {
    auth: {
      user: {
        name: string;
        email: string;
      };
    };
  }
}

declare module '@inertiajs/react' {
  interface PageProps extends InertiaPageProps {
    auth: {
      user: {
        name: string;
        email: string;
      };
    };
  }
}
