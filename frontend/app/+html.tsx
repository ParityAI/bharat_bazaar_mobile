// @ts-nocheck
import { ScrollViewStyleReset } from "expo-router/html";
import type { PropsWithChildren } from "react";

export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="en" style={{ height: "100%" }}>
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <ScrollViewStyleReset />
        <style
          dangerouslySetInnerHTML={{
            __html: `
              /* Phone frame: constrain app to mobile width on desktop */
              body {
                margin: 0;
                height: 100%;
                overflow: hidden;
                background: #0F172A;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
              }
              .phone-frame-label {
                color: rgba(255,255,255,0.5);
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                font-size: 14px;
                margin-bottom: 16px;
                text-align: center;
                letter-spacing: 0.5px;
              }
              .phone-frame {
                width: 100%;
                max-width: 390px;
                height: 100vh;
                max-height: 844px;
                background: #FAFAF9;
                border-radius: 40px;
                overflow: hidden;
                box-shadow: 0 25px 60px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.05);
                position: relative;
              }
              .phone-frame > div:first-child {
                position: absolute !important;
                top: 0; left: 0; right: 0; bottom: 0;
              }
              [role="tablist"] [role="tab"] * { overflow: visible !important; }
              [role="heading"], [role="heading"] * { overflow: visible !important; }

              @media (max-width: 500px) {
                body {
                  background: #FAFAF9;
                }
                .phone-frame-label {
                  display: none;
                }
                .phone-frame {
                  max-width: 100%;
                  max-height: 100vh;
                  border-radius: 0;
                  box-shadow: none;
                }
              }
            `,
          }}
        />
      </head>
      <body>
        <p className="phone-frame-label">BharatBazaar AI — Open on mobile for best experience</p>
        <div className="phone-frame">
          {children}
        </div>
      </body>
    </html>
  );
}
