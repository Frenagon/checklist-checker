/* eslint-disable @next/next/no-img-element */

import {
  type ReactElement,
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { flushSync } from 'react-dom';
import { useReactToPrint } from 'react-to-print';
import QRCode from 'qrcode';

const qrCodeDataUrlCache = new Map<string, Promise<string>>();
const printPageStyle = '@page { margin: 16mm; }';

type PrintQrCodeOptions = {
  title: string;
  subtitle: string;
  url: string;
};

type UseQrCodePrintResult = {
  qrCodeDataUrl: string | null;
  handlePrint: () => Promise<void>;
  printContent: ReactElement;
};

type QrCodePrintDocumentProps = PrintQrCodeOptions & {
  qrCodeDataUrl: string | null;
};

const QrCodePrintDocument = forwardRef<HTMLDivElement, QrCodePrintDocumentProps>(
  function QrCodePrintDocument({ title, subtitle, url, qrCodeDataUrl }, ref) {
    return (
      <div className="flex w-full justify-center bg-white text-black" ref={ref}>
        <div className="flex w-full max-w-[480px] flex-col items-center gap-6 text-center">
          <h1 className="text-[28px] leading-tight font-semibold">{title}</h1>
          <p className="text-base leading-relaxed">{subtitle}</p>
          {qrCodeDataUrl ? (
            <img
              alt={`${title} QR code`}
              className="size-80"
              src={qrCodeDataUrl}
            />
          ) : null}
          <code className="max-w-full break-words text-xs">{url}</code>
        </div>
      </div>
    );
  },
);

export async function getQrCodeDataUrl(value: string) {
  const existingDataUrl = qrCodeDataUrlCache.get(value);

  if (existingDataUrl) {
    return await existingDataUrl;
  }

  const dataUrlPromise = QRCode.toDataURL(value, {
    errorCorrectionLevel: 'H',
    margin: 1,
    width: 256,
  });

  qrCodeDataUrlCache.set(value, dataUrlPromise);

  try {
    return await dataUrlPromise;
  } catch (error) {
    qrCodeDataUrlCache.delete(value);
    throw error;
  }
}

export function useQrCodePrint({
  title,
  subtitle,
  url,
}: PrintQrCodeOptions): UseQrCodePrintResult {
  const contentRef = useRef<HTMLDivElement>(null);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string | null>(null);

  const reactToPrint = useReactToPrint({
    contentRef,
    documentTitle: title,
    pageStyle: printPageStyle,
  });

  useEffect(() => {
    let isCancelled = false;

    void getQrCodeDataUrl(url)
      .then((dataUrl) => {
        if (!isCancelled) {
          setQrCodeDataUrl(dataUrl);
        }
      })
      .catch(() => {
        if (!isCancelled) {
          setQrCodeDataUrl(null);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [url]);

  const handlePrint = useCallback(async () => {
    if (qrCodeDataUrl) {
      await reactToPrint();
      return;
    }

    const generatedQrCodeDataUrl = await getQrCodeDataUrl(url);
    flushSync(() => {
      setQrCodeDataUrl(generatedQrCodeDataUrl);
    });
    await reactToPrint();
  }, [qrCodeDataUrl, reactToPrint, url]);

  return {
    qrCodeDataUrl,
    handlePrint,
    printContent: (
      <div
        aria-hidden
        className="pointer-events-none fixed top-0 left-[-10000px] opacity-0"
      >
        <QrCodePrintDocument
          qrCodeDataUrl={qrCodeDataUrl}
          ref={contentRef}
          subtitle={subtitle}
          title={title}
          url={url}
        />
      </div>
    ),
  };
}
