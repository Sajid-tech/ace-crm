

import React, { useEffect, useRef, useState } from "react";
import Page from "../dashboard/page";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2} from "lucide-react";
import html2pdf from "html2pdf.js";
import BASE_URL, { getImageUrl, LetterHeadPdf, SIGN_IN_PURCHASE, signPdf} from "@/config/BaseUrl";
import { useParams } from "react-router-dom";
import  { useReactToPrint } from "react-to-print";
import moment from "moment";
import ContractActions from "./ContractActions";

import ContractViewPdf from "./contractView/ContractViewPdf";
import ContractViewPrintHeader from "./contractView/ContractViewPrintHeader";
import ContractViewPntWthHeader from "./contractView/ContractViewPntWthHeader";

const ViewContract = () => {
  const withoutHeaderSignRef = useRef()
  const HeaderWithSignRef = useRef()
  const pdfRef = useRef()
  const { id } = useParams();
  const [contractData, setContractData] = useState(null);
  const [loading, setLoading] = useState(true);
   const [showLetterhead, setShowLetterhead] = useState(false);
  const [showSignature, setShowSignature] = useState(false);
  const [error, setError] = useState(null);
  const [logoBase64, setLogoBase64] = useState("");

  useEffect(() => {
    const fetchContractData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${BASE_URL}/api/panel-fetch-contract-by-id/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch contract data");
        }

        const data = await response.json();
        if (!data?.branch?.branch_letter_head) {
          setLoading(true);
          setError("Letter head data is missing");
          return;
        }

        setContractData(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchContractData();
  }, [id]);
  
 useEffect(() => {
  if (!contractData?.branch?.branch_letter_head) {
    setLoading(false);
    return;
  }
          const convertLocalImageToBase64 = async () => {
            try {
              // for production 
              const logoUrl = `${LetterHeadPdf}/${contractData?.branch?.branch_letter_head}`;
              // for devlopement
              // const logoUrl = `/api/public/assets/images/letterHead/${contractData?.branch?.branch_letter_head}`;

        const response = await fetch(logoUrl);
        const blob = await response.blob();

        const reader = new FileReader();
        reader.onloadend = () => {
          setLogoBase64(reader.result);
        };
        reader.readAsDataURL(blob);
            } catch (error) {
              console.error("Error converting local image to base64:", error);
            }
          };
      
          if (contractData?.branch?.branch_letter_head) {
            convertLocalImageToBase64();
          }
        }, [contractData?.branch?.branch_letter_head]);



        const handleHeaderWithSignPdf = () => {
            if (!logoBase64) {
              console.error("Logo not yet loaded");
              return;
            }
            const element = pdfRef.current;
        
            const images = element.getElementsByTagName("img");
            let loadedImages = 0;
        
            if (images.length === 0) {
              generateHeaderWithSignPdf(element);
              return;
            }
        
            Array.from(images).forEach((img) => {
              if (img.complete) {
                loadedImages++;
                if (loadedImages === images.length) {
                  generateHeaderWithSignPdf(element);
                }
              } else {
                img.onload = () => {
                  loadedImages++;
                  if (loadedImages === images.length) {
                    generateHeaderWithSignPdf(element);
                  }
                };
              }
            });
          };
        

  const generateHeaderWithSignPdf = (element) => {
    if (!logoBase64) {
      console.error("Logo not yet converted to base64");
      return;
    }

    const options = {
      margin: [55, 0, 15, 0], // top , left , bottom , right
      filename: "Sales_Contract.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        windowHeight: element.scrollHeight,
      },
      jsPDF: {
        unit: "mm",
        format: "a4",
        orientation: "portrait",
      },
      pagebreak: { mode: "avoid-all" },
      // its no use
    };

    html2pdf()
      .from(element)
      .set(options)
      .toPdf()
      .get("pdf")
      .then((pdf) => {
        const totalPages = pdf.internal.getNumberOfPages();
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        for (let i = 1; i <= totalPages; i++) {
          pdf.setPage(i);

          // for logo
          pdf.addImage(logoBase64, "JPEG", 0, 10, pageWidth, 30);

          // Add contract title
          pdf.setFontSize(12);
          pdf.setFont(undefined, "normal");
          const title = "SALES CONTRACT";
          const titleWidth =
            (pdf.getStringUnitWidth(title) * 16) / pdf.internal.scaleFactor;
          pdf.text(title, (pageWidth - titleWidth) / 2, 45);

          // Add contract details
          pdf.setFontSize(9);
          pdf.text(
            `Cont No.: ${contractData?.contract?.contract_ref || ""}`,
            4,
            55
          );
          pdf.text(
            `DATE: ${contractData?.contract?.contract_date || ""}`,
            pageWidth - 31,
            55
          );
          // Add page no at the Bottom

          pdf.setFontSize(10);
          pdf.setTextColor(0, 0, 0);
          const text = `Page ${i} of ${totalPages}`;
          const textWidth =
            (pdf.getStringUnitWidth(text) * 10) / pdf.internal.scaleFactor;
          const x = pageWidth - textWidth - 10;
          const y = pageHeight - 10;
          pdf.text(text, x, y);
        }
      })
      .save();
  }; 










 
  const handleWithHeaderPdf = () => {
    if (!logoBase64) {
      console.error("Logo not yet loaded");
      return;
    }
    setShowSignature(false);
    const element = pdfRef.current;

    const images = element.getElementsByTagName("img");
    let loadedImages = 0;

    if (images.length === 0) {
      generateWithHeaderPdf(element);
      return;
    }

    Array.from(images).forEach((img) => {
      if (img.complete) {
        loadedImages++;
        if (loadedImages === images.length) {
          generateWithHeaderPdf(element);
        }
      } else {
        img.onload = () => {
          loadedImages++;
          if (loadedImages === images.length) {
            generateWithHeaderPdf(element);
          }
        };
      }
    });
  
  };


const generateWithHeaderPdf = (element) => {
if (!logoBase64) {
console.error("Logo not yet converted to base64");
return;
}

const options = {
margin: [55, 0, 15, 0], // top , left , bottom , right
filename: "Sales_Contract.pdf",
image: { type: "jpeg", quality: 0.98 },
html2canvas: {
scale: 2,
useCORS: true,
windowHeight: element.scrollHeight,
},
jsPDF: {
unit: "mm",
format: "a4",
orientation: "portrait",
},
pagebreak: { mode: "avoid-all" },
// its no use
};

html2pdf()
.from(element)
.set(options)
.toPdf()
.get("pdf")
.then((pdf) => {
const totalPages = pdf.internal.getNumberOfPages();
const pageWidth = pdf.internal.pageSize.getWidth();
const pageHeight = pdf.internal.pageSize.getHeight();
for (let i = 1; i <= totalPages; i++) {
  pdf.setPage(i);

  // for logo
  pdf.addImage(logoBase64, "JPEG", 0, 10, pageWidth, 30);

  // Add contract title
  pdf.setFontSize(12);
  pdf.setFont(undefined, "normal");
  const title = "SALES CONTRACT";
  const titleWidth =
    (pdf.getStringUnitWidth(title) * 16) / pdf.internal.scaleFactor;
  pdf.text(title, (pageWidth - titleWidth) / 2, 45);

  // Add contract details
  pdf.setFontSize(9);
  pdf.text(
    `Cont No.: ${contractData?.contract?.contract_ref || ""}`,
    4,
    55
  );
  pdf.text(
    `DATE: ${contractData?.contract?.contract_date || ""}`,
    pageWidth - 31,
    55
  );
  // Add page no at the Bottom

  pdf.setFontSize(10);
  pdf.setTextColor(0, 0, 0);
  const text = `Page ${i} of ${totalPages}`;
  const textWidth =
    (pdf.getStringUnitWidth(text) * 10) / pdf.internal.scaleFactor;
  const x = pageWidth - textWidth - 10;
  const y = pageHeight - 10;
  pdf.text(text, x, y);
}
})
.save();
};


  const handleSignWithoutHeaderPdf = () => {
   
    const element = pdfRef.current;
    generateSignWithoutHeaderPdf(element);
  };
  const generateSignWithoutHeaderPdf = (element) => {

    const options = {
      margin: [55, 0, 15, 0], // top , left , bottom , right
      filename: "Sales_Contract.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        windowHeight: element.scrollHeight,
      },
      jsPDF: {
        unit: "mm",
        format: "a4",
        orientation: "portrait",
      },
      pagebreak: { mode: "avoid-all" },
      // its no use
    };

    html2pdf()
      .from(element)
      .set(options)
      .toPdf()
      .get("pdf")
      .then((pdf) => {
        const totalPages = pdf.internal.getNumberOfPages();
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        for (let i = 1; i <= totalPages; i++) {
          pdf.setPage(i);

      

          // Add contract title
          pdf.setFontSize(12);
          pdf.setFont(undefined, "normal");
          const title = "SALES CONTRACT";
          const titleWidth =
            (pdf.getStringUnitWidth(title) * 16) / pdf.internal.scaleFactor;
          pdf.text(title, (pageWidth - titleWidth) / 2, 45);

          // Add contract details
          pdf.setFontSize(9);
          pdf.text(
            `Cont No.: ${contractData?.contract?.contract_ref || ""}`,
            4,
            55
          );
          pdf.text(
            `DATE: ${contractData?.contract?.contract_date || ""}`,
            pageWidth - 31,
            55
          );
          // Add page no at the Bottom

          pdf.setFontSize(10);
          pdf.setTextColor(0, 0, 0);
          const text = `Page ${i} of ${totalPages}`;
          const textWidth =
            (pdf.getStringUnitWidth(text) * 10) / pdf.internal.scaleFactor;
          const x = pageWidth - textWidth - 10;
          const y = pageHeight - 10;
          pdf.text(text, x, y);
        }
      })
      .save();
  };




  const handleWithoutHeaderPdf = () => {
    setShowSignature(false); 
    const element = pdfRef.current;
    generateWithoutHeaderPdf(element);
    
  };
  const generateWithoutHeaderPdf = (element) => {

    const options = {
      margin: [55, 0, 15, 0], // top , left , bottom , right
      filename: "Sales_Contract.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        windowHeight: element.scrollHeight,
      },
      jsPDF: {
        unit: "mm",
        format: "a4",
        orientation: "portrait",
      },
      pagebreak: { mode: "avoid-all" },
      // its no use
    };

    html2pdf()
      .from(element)
      .set(options)
      .toPdf()
      .get("pdf")
      .then((pdf) => {
        const totalPages = pdf.internal.getNumberOfPages();
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        for (let i = 1; i <= totalPages; i++) {
          pdf.setPage(i);

      

          // Add contract title
          pdf.setFontSize(12);
          pdf.setFont(undefined, "normal");
          const title = "SALES CONTRACT";
          const titleWidth =
            (pdf.getStringUnitWidth(title) * 16) / pdf.internal.scaleFactor;
          pdf.text(title, (pageWidth - titleWidth) / 2, 45);

          // Add contract details
          pdf.setFontSize(9);
          pdf.text(
            `Cont No.: ${contractData?.contract?.contract_ref || ""}`,
            4,
            55
          );
          pdf.text(
            `DATE: ${contractData?.contract?.contract_date || ""}`,
            pageWidth - 31,
            55
          );
          // Add page no at the Bottom

          pdf.setFontSize(10);
          pdf.setTextColor(0, 0, 0);
          const text = `Page ${i} of ${totalPages}`;
          const textWidth =
            (pdf.getStringUnitWidth(text) * 10) / pdf.internal.scaleFactor;
          const x = pageWidth - textWidth - 10;
          const y = pageHeight - 10;
          pdf.text(text, x, y);
        }
      })
      .save();
  };


// email function

// 1. without header without sign 

const mailWoheaderWoSign = async (element) => {
 
  const options = {
    margin: [55, 0, 15, 0],
    filename: "Sales_Contract.pdf",
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      windowHeight: element.scrollHeight,
    },
    jsPDF: {
      unit: "mm",
      format: "a4",
      orientation: "portrait",
    },
    pagebreak: { mode: "avoid-all" },
  };

  return new Promise((resolve) => {
    html2pdf()
      .from(element)
      .set(options)
      .toPdf()
      .get("pdf")
      .then((pdf) => {
        const totalPages = pdf.internal.getNumberOfPages();
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        
        for (let i = 1; i <= totalPages; i++) {
          pdf.setPage(i);
          
          // Add contract title
          pdf.setFontSize(12);
          pdf.setFont(undefined, "normal");
          const title = "SALES CONTRACT";
          const titleWidth = (pdf.getStringUnitWidth(title) * 16) / pdf.internal.scaleFactor;
          pdf.text(title, (pageWidth - titleWidth) / 2, 45);

          // Add contract details
          pdf.setFontSize(9);
          pdf.text(`Cont No.: ${contractData?.contract?.contract_ref || ""}`, 4, 55);
          pdf.text(`DATE: ${contractData?.contract?.contract_date || ""}`, pageWidth - 31, 55);

          // Add page number
          pdf.setFontSize(10);
          pdf.setTextColor(0, 0, 0);
          const text = `Page ${i} of ${totalPages}`;
          const textWidth = (pdf.getStringUnitWidth(text) * 10) / pdf.internal.scaleFactor;
          const x = pageWidth - textWidth - 10;
          const y = pageHeight - 10;
          pdf.text(text, x, y);
        }

        // Convert PDF to blob
        const pdfBlob = pdf.output('blob');
        resolve(pdfBlob);
      });
  });
};

// 2. with header with isgn 

const mailheadersign = () => {
  return new Promise((resolve, reject) => {
    if (!logoBase64) {
      reject(new Error("Logo not yet loaded"));
      return;
    }
    setShowSignature(true);
    const element = pdfRef.current;
    const images = element.getElementsByTagName("img");
    let loadedImages = 0;

    if (images.length === 0) {
      mailgenerateHS(element)
        .then(resolve)
        .catch(reject);
      return;
    }

    Array.from(images).forEach((img) => {
      if (img.complete) {
        loadedImages++;
        if (loadedImages === images.length) {
          mailgenerateHS(element)
            .then(resolve)
            .catch(reject);
        }
      } else {
        img.onload = () => {
          loadedImages++;
          if (loadedImages === images.length) {
            mailgenerateHS(element)
              .then(resolve)
              .catch(reject);
          }
        };
        img.onerror = () => {
          reject(new Error("Failed to load image"));
        };
      }
    });
  });
};

// 3. with header without sign

const mailHeaderWOSign = () => {
  return new Promise((resolve, reject) => {
    if (!logoBase64) {
      reject(new Error("Logo not yet loaded"));
      return;
    }
    
    const element = pdfRef.current;
    const images = element.getElementsByTagName("img");
    let loadedImages = 0;

    if (images.length === 0) {
      mailgenerateHS(element)
        .then(resolve)
        .catch(reject);
      return;
    }

    Array.from(images).forEach((img) => {
      if (img.complete) {
        loadedImages++;
        if (loadedImages === images.length) {
          mailgenerateHS(element)
            .then(resolve)
            .catch(reject);
        }
      } else {
        img.onload = () => {
          loadedImages++;
          if (loadedImages === images.length) {
            mailgenerateHS(element)
              .then(resolve)
              .catch(reject);
          }
        };
        img.onerror = () => {
          reject(new Error("Failed to load image"));
        };
      }
    });
  });
};

const mailgenerateHS = (element) => {
  return new Promise((resolve, reject) => {
    if (!logoBase64) {
      reject(new Error("Logo not yet converted to base64"));
      return;
    }

    const options = {
      margin: [55, 0, 15, 0], // top, left, bottom, right
      filename: "Sales_Contract.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        windowHeight: element.scrollHeight,
      },
      jsPDF: {
        unit: "mm",
        format: "a4",
        orientation: "portrait",
      },
      pagebreak: { mode: "avoid-all" },
    };

    html2pdf()
      .from(element)
      .set(options)
      .toPdf()
      .get("pdf")
      .then((pdf) => {
        try {
          const totalPages = pdf.internal.getNumberOfPages();
          const pageWidth = pdf.internal.pageSize.getWidth();
          const pageHeight = pdf.internal.pageSize.getHeight();
          
          for (let i = 1; i <= totalPages; i++) {
            pdf.setPage(i);

            // Add logo
            pdf.addImage(logoBase64, "JPEG", 0, 10, pageWidth, 30);

            // Add contract title
            pdf.setFontSize(12);
            pdf.setFont(undefined, "normal");
            const title = "SALES CONTRACT";
            const titleWidth = (pdf.getStringUnitWidth(title) * 16) / pdf.internal.scaleFactor;
            pdf.text(title, (pageWidth - titleWidth) / 2, 45);

            // Add contract details
            pdf.setFontSize(9);
            pdf.text(
              `Cont No.: ${contractData?.contract?.contract_ref || ""}`,
              4,
              55
            );
            pdf.text(
              `DATE: ${contractData?.contract?.contract_date || ""}`,
              pageWidth - 31,
              55
            );

            // Add page number
            pdf.setFontSize(10);
            pdf.setTextColor(0, 0, 0);
            const text = `Page ${i} of ${totalPages}`;
            const textWidth = (pdf.getStringUnitWidth(text) * 10) / pdf.internal.scaleFactor;
            const x = pageWidth - textWidth - 10;
            const y = pageHeight - 10;
            pdf.text(text, x, y);
          }

          // Convert PDF to blob and resolve
          const pdfBlob = pdf.output('blob');
          resolve(pdfBlob);
        } catch (error) {
          reject(error);
        }
      })
      .catch(reject);
  });
};

// without header with sign


const mailWOheadersign = async (element) => {
  setShowSignature(true);
  const options = {
    margin: [55, 0, 15, 0],
    filename: "Sales_Contract.pdf",
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      windowHeight: element.scrollHeight,
    },
    jsPDF: {
      unit: "mm",
      format: "a4",
      orientation: "portrait",
    },
    pagebreak: { mode: "avoid-all" },
  };

  return new Promise((resolve) => {
    html2pdf()
      .from(element)
      .set(options)
      .toPdf()
      .get("pdf")
      .then((pdf) => {
        const totalPages = pdf.internal.getNumberOfPages();
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        
        for (let i = 1; i <= totalPages; i++) {
          pdf.setPage(i);
          
          // Add contract title
          pdf.setFontSize(12);
          pdf.setFont(undefined, "normal");
          const title = "SALES CONTRACT";
          const titleWidth = (pdf.getStringUnitWidth(title) * 16) / pdf.internal.scaleFactor;
          pdf.text(title, (pageWidth - titleWidth) / 2, 45);

          // Add contract details
          pdf.setFontSize(9);
          pdf.text(`Cont No.: ${contractData?.contract?.contract_ref || ""}`, 4, 55);
          pdf.text(`DATE: ${contractData?.contract?.contract_date || ""}`, pageWidth - 31, 55);

          // Add page number
          pdf.setFontSize(10);
          pdf.setTextColor(0, 0, 0);
          const text = `Page ${i} of ${totalPages}`;
          const textWidth = (pdf.getStringUnitWidth(text) * 10) / pdf.internal.scaleFactor;
          const x = pageWidth - textWidth - 10;
          const y = pageHeight - 10;
          pdf.text(text, x, y);
        }

        // Convert PDF to blob
        const pdfBlob = pdf.output('blob');
        resolve(pdfBlob);
      });
  });
};

// print functions
  const handleWithHeaderPrint = useReactToPrint({
    content: () => HeaderWithSignRef.current,
    documentTitle: "contract-view",
    pageStyle: `
      @page {
      size: auto;
     margin: 0mm 0mm 5mm 0mm;
      
    }
    @media print {
      body {
        border: 0px solid red;
        margin: 1mm;
        padding: 1mm 1mm 1mm 1mm;
        min-height: 100vh;
      }
      .print-hide {
        display: none;
      }
     
    }
    `,
  });
  const handleWithoutHeaderPrint = useReactToPrint({
    content: () => withoutHeaderSignRef.current,
    documentTitle: "contract-view",
    pageStyle: `
      @page {
      size: auto;
       margin: 0mm 0mm 5mm 0mm;
      
    }
    @media print {
      body {
        border: 0px solid blue;
        margin: 1mm;
        padding: 1mm 1mm 1mm 1mm;
        min-height: 100vh;
      }
      .print-hide-header {
        display: none;
      }
     
    }
    `,
  });

  const handleSignWithHeaderPrint = useReactToPrint({
    content: () => HeaderWithSignRef.current,
    documentTitle: "contract-view",
    pageStyle: `
      @page {
      size: auto;
    margin: 0mm 0mm 5mm 0mm;
      
    }
    @media print {
      body {
        border: 0px solid yellow;
        margin: 1mm;
        padding: 1mm 1mm 1mm 1mm;
        min-height: 100vh;
      }
      .print-hide-header-sign {
        display: none;
      }
     
    }
    `,
  });

  const handleSignWithoutHeader = useReactToPrint({
    content: () => withoutHeaderSignRef.current,
    documentTitle: "contract-view",
    pageStyle: `
      @page {
      size: auto;
      margin: 0mm 0mm 5mm 0mm;
      
    }
    @media print {
      body {
        border: 0px solid purple;
        margin: 1mm;
        padding: 1mm 1mm 1mm 1mm;
        min-height: 100vh;
      }
      .print-hide {
        display: none;
      }
     
    }
    `,
  });
  

  // const PdfHeader = () => (
  //   <div
  //     className="print-header hidden print:block"
     
  //   >
  //     <img
  //       src={LetterHeadPDFImage}
  //       alt="logo"
  //       className="w-full max-h-[120px] object-contain"
  //     />
  //     <h1 className="text-center text-[15px] underline font-bold mt-4">
  //       SALES CONTRACT
  //     </h1>
  //     <div className="p-4 flex items-center justify-between">
  //       <p>
  //         <span className="font-semibold text-[12px]">Cont No.:</span>
  //         {contractData?.contract?.contract_ref}
  //       </p>
  //       <p>
  //         <span className="font-semibold text-[12px]">DATE:</span>
  //         {moment(contractData?.contract?.contract_date).format("DD-MMM-YYYY")}
  //       </p>
  //     </div>
  //   </div>
  // );
  const PrintHeader = () => (
    <div
      className="print-header hidden print:block"
     
    >
      <img
       src={getImageUrl(contractData?.branch?.branch_letter_head)}
        alt="logo"
        className="w-full max-h-[120px] object-contain"
      />
      <h1 className="text-center text-[15px] underline font-bold mt-4">
        SALES CONTRACT
      </h1>
      <div className="p-4 flex items-center justify-between">
        <p>
          <span className="font-semibold text-[12px]">Cont No.:</span>
          {contractData?.contract?.contract_ref}
        </p>
        <p>
          <span className="font-semibold text-[12px]">DATE:</span>
          {moment(contractData?.contract?.contract_date).format("DD-MMM-YYYY")}
        </p>
      </div>
    </div>
  );
  const PrintWithoutHeader = () => (
    <div
      className="without-print-header hidden print:block"
 
    >
     <div  style={{
      marginTop:"130px"
     }}>
      <h1 className="text-center text-[15px] underline font-bold mt-4">
        SALES CONTRACT 
      </h1>
      <div className="p-4 flex items-center justify-between">
        <p>
          <span className="font-semibold text-[12px]">Cont No.:</span>
          {contractData?.contract?.contract_ref}
        </p>
        <p>
          <span className="font-semibold text-[12px]">DATE:</span>
          {moment(contractData?.contract?.contract_date).format("DD-MMM-YYYY")}
        </p>
      </div>
      </div>
    </div>
  );
  if (loading) {
    return (
      <Page>
        <div className="flex justify-center items-center h-full">
          <Button disabled>
            <Loader2 className=" h-4 w-4 animate-spin" />
            Loading contract Data
          </Button>
        </div>
      </Page>
    );
  }

  if (error) {
    return (
      <Page>
        <Card className="w-full max-w-md mx-auto mt-10">
          <CardHeader>
            <CardTitle className="text-destructive">
              Error Fetching contract Data
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button variant="outline">Try Again</Button>
          </CardContent>
        </Card>
      </Page>
    );
  }
  return (
    <Page>
      <div className="  flex w-full  p-2 gap-2 relative ">
        <div className="w-[85%] border border-gray-200 rounded-lg p-1">
        {showLetterhead && (
          <div className="      ">
            <img
             src={getImageUrl(contractData?.branch?.branch_letter_head)}
              alt="logo"
              className="w-full"
            />
            <h1 className="text-center text-[15px] underline font-bold ">
              SALES CONTRACT
            </h1>
            <div className=" p-4 flex items-center justify-between">
              <p>
                <span className="font-semibold text-[12px]">Cont No.:</span>
                {contractData?.contract?.contract_ref}
              </p>
              <p>
                <span className="font-semibold text-[12px]">DATE:</span>{" "}
                {moment(contractData?.contract?.contract_date).format(
                  "DD-MMM-YYYY"
                )}
              </p>
            </div>
          </div>
             )}

          <div ref={HeaderWithSignRef} className="  hidden print:block     font-normal ">
           
           <PrintHeader/>
           {contractData && (
             <>
            <ContractViewPrintHeader
            
            contractData={contractData}
            showSignature={showSignature}
            SIGN_IN_PURCHASE={SIGN_IN_PURCHASE}


            />
             </>
           )}
         </div>


 {/* only for pdf  */}
 <div ref={pdfRef} className="    min-h-screen font-normal ">
           
           {/* <PdfHeader/> */}
           {contractData && (
             <>
            <ContractViewPdf
            contractData={contractData}
            showSignature={showSignature}
            signPdf={signPdf}
            
            />
             </>
           )}
         </div>

       {/* only for  without header  */}
          <div ref={withoutHeaderSignRef} className=" hidden print:block     font-normal ">
           
            <PrintWithoutHeader/>
            {contractData && (
              <>
               <ContractViewPntWthHeader
               
               contractData={contractData}
               SIGN_IN_PURCHASE={SIGN_IN_PURCHASE}
               
               />
              </>
            )}
          </div>
       
        </div>

        <div className="fixed w-[15%] flex flex-col right-0 bottom-10 h-[30vh] border border-gray-200   rounded-lg  p-2 ">
          <ContractActions
           showLetterhead={showLetterhead}
           setShowLetterhead={setShowLetterhead}
           showSignature={showSignature}
           setShowSignature={setShowSignature}
          // print 
            handleWithHeaderPrint={handleWithHeaderPrint}
            handleWithoutHeaderPrint={handleWithoutHeaderPrint}
            handleSignWithoutHeader={handleSignWithoutHeader}
            handleSignWithHeaderPrint={handleSignWithHeaderPrint}
            // pdf 


            handleHeaderWithSignPdf={handleHeaderWithSignPdf}
            handleWithHeaderPdf={handleWithHeaderPdf}
            handleSignWithoutHeaderPdf={handleSignWithoutHeaderPdf}
            handleWithoutHeaderPdf={handleWithoutHeaderPdf}
            // whatsappWithoutHeaderPdf={whatsappWithoutHeaderPdf}
            // email 
            pdfRef={pdfRef} 
            mailWoheaderWoSign={mailWoheaderWoSign}
            mailheadersign={mailheadersign}
            mailHeaderWOSign={mailHeaderWOSign}
            mailWOheadersign={mailWOheadersign}
        
          />
        </div>
      </div>
      
    </Page>
  );
};

export default ViewContract;



