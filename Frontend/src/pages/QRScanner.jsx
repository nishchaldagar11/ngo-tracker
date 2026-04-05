import { useEffect } from "react";
import { Html5Qrcode } from "html5-qrcode";
import API from "../services/api";

export default function QRScanner() {

  useEffect(() => {

    const scanner = new Html5Qrcode("reader");

    scanner.start(
      { facingMode: "environment" }, // back camera
      {
        fps: 10,
        qrbox: 250,
      },
      async (decodedText) => {
        try {
          console.log("QR DATA:", decodedText);

          const data = JSON.parse(decodedText);

          const res = await API.post("/attendance/mark", {
            eventId: data.eventId,
            volunteerId: data.volunteerId
          });

          alert(res.data.message);

        } catch (err) {
          alert("Invalid QR");
        }
      },
      (errorMessage) => {
        // ignore scan errors
      }
    );

    return () => {
      scanner.stop().catch(() => {});
    };

  }, []);

  return (
    <div className="p-6">

      <h1 className="text-2xl font-bold mb-4">
        Scan QR Code
      </h1>

      <div id="reader" style={{ width: "300px" }} />

    </div>
  );
}