import React, { useEffect, useState } from "react";
import ZebraBrowserPrintWrapper from "zebra-browser-print-wrapper";

type Printer = {
  name: string;
};

type PrinterStatus = {
  isReadyToPrint: boolean;
  errors: string;
};

const PrinterManager: React.FC = () => {
  const [browserPrint, setBrowserPrint] = useState<any>(null);
  const [printers, setPrinters] = useState<Printer[]>([]);
  const [selectedPrinter, setSelectedPrinter] = useState<Printer | null>(null);
  const [status, setStatus] = useState<string>("Loading...");
  const [serial, setSerial] = useState<string>("0123456789");

  useEffect(() => {
    const init = async () => {
      try {
        const bp = new ZebraBrowserPrintWrapper();
        setBrowserPrint(bp);

        const printerList = await bp.getAvailablePrinters();
        setPrinters(printerList);
        console.log("all printers", printerList);

        const defaultPrinter = await bp.getDefaultPrinter();
        console.log("default printer", defaultPrinter);
        if (defaultPrinter) {
          bp.setPrinter(defaultPrinter);
          setSelectedPrinter(defaultPrinter);
          const printerStatus: PrinterStatus = await bp.checkPrinterStatus();
          console.log("status printer", printerStatus);
          updateStatus(printerStatus);
        } else {
          setStatus("No default printer found.");
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          setStatus("Error initializing printer: " + error.message);
        } else {
          setStatus("Error initializing printer: Unknown error");
        }
      }
    };

    init();
  }, []);

  const updateStatus = (printerStatus: PrinterStatus) => {
    if (printerStatus.isReadyToPrint) {
      setStatus("Ready to print.");
    } else {
      setStatus(`Printer Error: ${printerStatus.errors}`);
    }
  };

  const handlePrinterChange = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const printerName = e.target.value;
    const printer = printers.find((p) => p.name === printerName);

    if (printer && browserPrint) {
      browserPrint.setPrinter(printer);
      setSelectedPrinter(printer);
      const printerStatus: PrinterStatus =
        await browserPrint.checkPrinterStatus();
      updateStatus(printerStatus);
    }
  };

  const handlePrint = async () => {
    if (!browserPrint || !selectedPrinter) {
      setStatus("Printer not selected.");
      return;
    }

    const printerStatus: PrinterStatus =
      await browserPrint.checkPrinterStatus();
    if (!printerStatus.isReadyToPrint) {
      setStatus(`Printer Error: ${printerStatus.errors}`);
      return;
    }

    const zpl = `^XA
^BY2,2,100
^FO20,20^BC^FD${serial}^FS
^XZ`;

    try {
      await browserPrint.print(zpl);
      setStatus(`Printed barcode: ${serial}`);
    } catch (err: any) {
      setStatus("Print error: " + err.message);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Zebra ZD230 Barcode Printing</h2>

      <div>
        <label>Serial to Print: </label>
        <input value={serial} onChange={(e) => setSerial(e.target.value)} />
      </div>

      <div>
        <label>Select Printer: </label>
        <select
          onChange={handlePrinterChange}
          value={selectedPrinter?.name || ""}
        >
          <option value="">-- Choose Printer --</option>
          {printers?.map((printer, idx) => (
            <option key={idx} value={printer.name}>
              {printer.name}
            </option>
          ))}
        </select>
      </div>

      <p>Status: {status}</p>

      <button onClick={handlePrint}>Print Barcode</button>
    </div>
  );
};

export default PrinterManager;
