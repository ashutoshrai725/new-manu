// src/utils/TemplateEngine.jsx

import React from "react";

// Utility function for random 2-digit string
const getRandomTwoDigits = () => String(Math.floor(Math.random() * 100)).padStart(2, "0");

const buildDocIds = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const randomTwoDigits = getRandomTwoDigits();
  const uniqueEnding = `00${randomTwoDigits}`;
  return {
    invoiceNumber: `INV/${year}${month}/${uniqueEnding}`,
    Number: `/${year}${month}/${uniqueEnding}`,
    Number1: `/${year}${month}/00${getRandomTwoDigits()}`,
    Number2: `/${year}${month}/00${getRandomTwoDigits()}`,
    Number3: `/${year}${month}/00${getRandomTwoDigits()}`,
    Number4: `/${year}${month}/00${getRandomTwoDigits()}`
  };
};

const parseProducts = (productInput) => {
  if (!productInput) return [];
  if (Array.isArray(productInput)) {
    return productInput.map((p, idx) => ({
      sno: idx + 1,
      item: p.item || "",
      description: p.description || "",
      hsCode: p.hsCode || "",
      quantity: parseFloat(p.quantity) || 0,
      unitPrice: parseFloat(p.unitPrice) || 0,
      amount: (parseFloat(p.quantity) || 0) * (parseFloat(p.unitPrice) || 0)
    }));
  }
  const lines = productInput.split('\n').filter(line => line.trim());
  return lines.map((line, index) => {
    const parts = line.split('|').map(part => part.trim());
    return {
      sno: index + 1,
      item: parts[0] || "",
      description: parts[1] || "",
      hsCode: parts[2] || "",
      quantity: parseFloat(parts[3]) || 0,
      unitPrice: parseFloat(parts[4]) || 0,
      amount: (parseFloat(parts[3]) || 0) * (parseFloat(parts[4]) || 0)
    };
  }).filter(Boolean);
};

const calculateTotals = (products, currency = 'USD') => {
  const subtotal = products.reduce((sum, product) => sum + product.amount, 0);
  return {
    subtotal: subtotal.toFixed(2),
    currency
  };
};

// Document Templates as functional components

export function CommercialInvoice({ company, inputs, docIds, currentDate }) {
  const products = parseProducts(inputs.products);
  const totals = calculateTotals(products, inputs.currency);

  return (
    <div className="document-container" style={{ maxWidth: 800, margin: "0 auto", padding: 20, fontFamily: "Arial, sans-serif", background: "white" }}>
      <div style={{ textAlign: "center", borderBottom: "3px solid #16a34a", paddingBottom: 15, marginBottom: 20 }}>
        <h1 style={{ color: "#16a34a", margin: 0, fontSize: 28, fontWeight: "bold" }}>COMMERCIAL INVOICE</h1>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 30, marginBottom: 25 }}>
        <div style={{ border: "1px solid #e5e7eb", padding: 15, borderRadius: 8 }}>
          <h3 style={{ color: "#16a34a", marginTop: 0, fontSize: 14, fontWeight: "bold" }}>EXPORTER / SELLER</h3>
          <p style={{ margin: "5px 0", fontWeight: "bold" }}>{company.company_name || "Company Name"}</p>
          <p style={{ margin: "3px 0", fontSize: 13 }}>{company.comp_reg_address || "Company Address"}</p>
        </div>
        <div style={{ border: "1px solid #e5e7eb", padding: 15, borderRadius: 8 }}>
          <h3 style={{ color: "#16a34a", marginTop: 0, fontSize: 14, fontWeight: "bold" }}>BUYER / CONSIGNEE</h3>
          <p style={{ margin: "5px 0", fontWeight: "bold" }}>{inputs.buyer_company || "Buyer Company Name"}</p>
          <p style={{ margin: "3px 0", fontSize: 13, whiteSpace: "pre-line" }}>{inputs.buyer_address || "Buyer Address"}</p>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 30, marginBottom: 25 }}>
        <div>
          <div style={{ marginBottom: 8 }}><strong>Invoice No:</strong> {docIds.invoiceNumber}</div>
          <div style={{ marginBottom: 8 }}><strong>Date:</strong> {currentDate}</div>
          <div><strong>Currency:</strong> {inputs.currency || 'USD'}</div>
        </div>
        <div>
          <div style={{ marginBottom: 8 }}><strong>Port of Loading:</strong> {inputs.port_loading || 'Port of Loading'}</div>
          <div style={{ marginBottom: 8 }}><strong>Port of Discharge:</strong> {inputs.port_discharge || 'Port of Discharge'}</div>
          <div><strong>Mode of Transport:</strong> {inputs.transport_mode || 'Transport Mode'}</div>
        </div>
      </div>
      <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 20, fontSize: 13 }}>
        <thead>
          <tr style={{ background: "#16a34a", color: "white" }}>
            <th style={{ border: "1px solid #16a34a", padding: 10, textAlign: "left", width: "8%" }}>S.No</th>
            <th style={{ border: "1px solid #16a34a", padding: 10, textAlign: "left", width: "25%" }}>Item</th>
            <th style={{ border: "1px solid #16a34a", padding: 10, textAlign: "left", width: "35%" }}>Description</th>
            <th style={{ border: "1px solid #16a34a", padding: 10 }}>HS Code</th>
            <th style={{ border: "1px solid #16a34a", padding: 10, textAlign: "center", width: "10%" }}>Qty</th>
            <th style={{ border: "1px solid #16a34a", padding: 10, textAlign: "right", width: "12%" }}>Unit Price</th>
            <th style={{ border: "1px solid #16a34a", padding: 10, textAlign: "right", width: "15%" }}>Amount</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.sno}>
              <td style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "center" }}>{product.sno}</td>
              <td style={{ border: "1px solid #e5e7eb", padding: 8 }}>{product.item}</td>
              <td style={{ border: "1px solid #e5e7eb", padding: 8 }}>{product.description}</td>
              <td style={{ border: "1px solid #e5e7eb", padding: 8 }}>{product.hsCode || ""}</td>
              <td style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "center" }}>{product.quantity}</td>
              <td style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "right" }}>{totals.currency} {product.unitPrice.toFixed(2)}</td>
              <td style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "right" }}>{totals.currency} {product.amount.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 30 }}>
        <div style={{ border: "2px solid #16a34a", padding: 15, borderRadius: 8, minWidth: 250 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10, fontSize: 16 }}>
            <strong>Total Amount:</strong>
            <strong>{totals.currency} {totals.subtotal}</strong>
          </div>
          <div style={{ fontSize: 12, color: "#666", textAlign: "center" }}>
            ({inputs.transport_mode || "FOB"} - {inputs.port_loading || "Port of Loading"})
          </div>
        </div>
      </div>
      <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: 15, fontSize: 11, color: "#666" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          <div>
            <p><strong>Terms &amp; Conditions:</strong></p>
            <ul style={{ margin: "5px 0", paddingLeft: 15 }}>
              <li>Payment: As per agreement</li>
              <li>Delivery: {inputs.transport_mode || "As specified"}</li>
            </ul>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ marginBottom: 40 }}><strong>For {company.company_name || "Company Name"}</strong></p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProformaInvoice({ company, inputs, docIds, currentDate }) {
  // Proforma replaces header and invoice number prefix
  const proformaIds = { ...docIds, invoiceNumber: `PI${docIds.Number1}` };
  return <CommercialInvoice company={company} inputs={inputs} docIds={proformaIds} currentDate={currentDate} />;
}

// ---- Packing List ----
export function PackingList({ company, inputs, docIds, currentDate }) {
  const products = parseProducts(inputs.products);

  const totalNet = products.reduce((sum, p) => sum + (p.quantity * 10), 0).toFixed(1);
  const totalGross = products.reduce((sum, p) => sum + (p.quantity * 12), 0).toFixed(1);

  return (
    <div className="document-container" style={{ maxWidth: 800, margin: "0 auto", padding: 20, fontFamily: "Arial, sans-serif", background: "white" }}>
      <div style={{ textAlign: "center", borderBottom: "3px solid #16a34a", paddingBottom: 15, marginBottom: 20 }}>
        <h1 style={{ color: "#16a34a", margin: 0, fontSize: 28, fontWeight: "bold" }}>PACKING LIST</h1>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 30, marginBottom: 25 }}>
        <div style={{ border: "1px solid #e5e7eb", padding: 15, borderRadius: 8 }}>
          <h3 style={{ color: "#16a34a", marginTop: 0, fontSize: 14, fontWeight: "bold" }}>EXPORTER / SELLER</h3>
          <p style={{ margin: "5px 0", fontWeight: "bold" }}>{company.company_name || "Company Name"}</p>
          <p style={{ margin: "3px 0", fontSize: 13 }}>{company.comp_reg_address || "Company Address"}</p>
        </div>
        <div style={{ border: "1px solid #e5e7eb", padding: 15, borderRadius: 8 }}>
          <h3 style={{ color: "#16a34a", marginTop: 0, fontSize: 14, fontWeight: "bold" }}>BUYER / CONSIGNEE</h3>
          <p style={{ margin: "5px 0", fontWeight: "bold" }}>{inputs.buyer_company || "Buyer Company Name"}</p>
          <p style={{ margin: "3px 0", fontSize: 13, whiteSpace: "pre-line" }}>{inputs.buyer_address || "Buyer Address"}</p>
        </div>
      </div>
      <div style={{ marginBottom: 25 }}>
        <div><strong>Packing List No:</strong> PL{Date.now()}</div>
        <div><strong>Date:</strong> {currentDate}</div>
        <div><strong>Invoice Reference:</strong> {docIds.invoiceNumber}</div>
      </div>
      <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 20, fontSize: 13 }}>
        <thead>
          <tr style={{ background: "#16a34a", color: "white" }}>
            <th style={{ border: "1px solid #16a34a", padding: 10 }}>Package No.</th>
            <th style={{ border: "1px solid #16a34a", padding: 10 }}>Item Description</th>
            <th style={{ border: "1px solid #16a34a", padding: 10 }}>HS Code</th>
            <th style={{ border: "1px solid #16a34a", padding: 10 }}>Quantity</th>
            <th style={{ border: "1px solid #16a34a", padding: 10 }}>Net Weight (Kg)</th>
            <th style={{ border: "1px solid #16a34a", padding: 10 }}>Gross Weight (Kg)</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr key={index}>
              <td style={{ border: "1px solid #e5e7eb", padding: 8 }}>{`PKG-${String(index + 1).padStart(3, "0")}`}</td>
              <td style={{ border: "1px solid #e5e7eb", padding: 8 }}>{product.item} - {product.description}</td>
              <td style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "center" }}>{product.hsCode || ""}</td>
              <td style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "center" }}>{product.quantity}</td>
              <td style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "center" }}>{(product.quantity * 10).toFixed(1)}</td>
              <td style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "center" }}>{(product.quantity * 12).toFixed(1)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ border: "1px solid #e5e7eb", padding: 15, borderRadius: 8, marginBottom: 20 }}>
        <h3 style={{ color: "#16a34a", marginTop: 0 }}>Shipment Summary</h3>
        <div><strong>Total Packages:</strong> {products.length}</div>
        <div><strong>Total Net Weight:</strong> {totalNet} Kg</div>
        <div><strong>Total Gross Weight:</strong> {totalGross} Kg</div>
      </div>
      <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: 15, fontSize: 11, color: "#666", textAlign: "right" }}>
        <p style={{ marginBottom: 40 }}><strong>For {company.company_name || "Company Name"}</strong></p>
      </div>
    </div>
  );
}

// ---- Delivery Challan ----
export function DeliveryChallan({ company, inputs, docIds, currentDate }) {
  const products = parseProducts(inputs.products);
  return (
    <div className="document-container" style={{ maxWidth: 800, margin: "0 auto", padding: 20, fontFamily: "Arial, sans-serif", background: "white" }}>
      <div style={{ textAlign: "center", borderBottom: "3px solid #16a34a", paddingBottom: 15, marginBottom: 20 }}>
        <h1 style={{ color: "#16a34a", margin: 0, fontSize: 28, fontWeight: "bold" }}>DELIVERY CHALLAN</h1>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 30, marginBottom: 25 }}>
        <div style={{ border: "1px solid #e5e7eb", padding: 15, borderRadius: 8 }}>
          <h3 style={{ color: "#16a34a", marginTop: 0, fontSize: 14, fontWeight: "bold" }}>EXPORTER / SELLER</h3>
          <p style={{ margin: "5px 0", fontWeight: "bold" }}>{company.company_name || "Company Name"}</p>
          <p style={{ margin: "3px 0", fontSize: 13 }}>{company.comp_reg_address || "Company Address"}</p>
        </div>
        <div style={{ border: "1px solid #e5e7eb", padding: 15, borderRadius: 8 }}>
          <h3 style={{ color: "#16a34a", marginTop: 0, fontSize: 14, fontWeight: "bold" }}>DELIVERY TO</h3>
          <p style={{ margin: "5px 0", fontWeight: "bold" }}>{inputs.buyer_company || "Buyer Company Name"}</p>
          <p style={{ margin: "3px 0", fontSize: 13, whiteSpace: "pre-line" }}>{inputs.buyer_address || "Buyer Address"}</p>
        </div>
      </div>
      <div style={{ marginBottom: 20 }}>
        <div><strong>Challan No:</strong> DC{docIds.Number2}</div>
        <div><strong>Date:</strong> {currentDate}</div>
        <div><strong>Invoice Reference:</strong> {docIds.invoiceNumber}</div>
      </div>
      <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 20, fontSize: 13 }}>
        <thead>
          <tr style={{ background: "#16a34a", color: "white" }}>
            <th style={{ border: "1px solid #16a34a", padding: 10 }}>S. No.</th>
            <th style={{ border: "1px solid #16a34a", padding: 10 }}>Description of Goods</th>
            <th style={{ border: "1px solid #16a34a", padding: 10 }}>Quantity</th>
            <th style={{ border: "1px solid #16a34a", padding: 10 }}>Unit</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.sno}>
              <td style={{ border: "1px solid #e5e7eb", padding: 8 }}>{product.sno}</td>
              <td style={{ border: "1px solid #e5e7eb", padding: 8 }}>{product.item} - {product.description}</td>
              <td style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "center" }}>{product.quantity}</td>
              <td style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "center" }}>Nos</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ fontSize: 11, color: "#666" }}>
        <p><strong>Note:</strong> Delivery is subject to the terms and conditions agreed upon in the contract.</p>
      </div>
      <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: 15, fontSize: 11, color: "#666", textAlign: "right" }}>
        <p style={{ marginBottom: 40 }}><strong>For {company.company_name || "Company Name"}</strong></p>
      </div>
    </div>
  );
}

// ---- Credit Note ----
export function CreditNote({ company, inputs, docIds, currentDate }) {
  return (
    <div className="document-container" style={{ maxWidth: 800, margin: "0 auto", padding: 20, fontFamily: "Arial, sans-serif", background: "white" }}>
      <div style={{ textAlign: "center", borderBottom: "3px solid #16a34a", paddingBottom: 15, marginBottom: 20 }}>
        <h1 style={{ color: "#16a34a", margin: 0, fontSize: 28, fontWeight: "bold" }}>CREDIT NOTE</h1>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 30, marginBottom: 25 }}>
        <div style={{ border: "1px solid #e5e7eb", padding: 15, borderRadius: 8 }}>
          <h3 style={{ color: "#16a34a", marginTop: 0, fontSize: 14, fontWeight: "bold" }}>SELLER / ISSUER</h3>
          <p style={{ margin: "5px 0", fontWeight: "bold" }}>{company.company_name || "Company Name"}</p>
          <p style={{ margin: "3px 0", fontSize: 13 }}>{company.comp_reg_address || "Company Address"}</p>
        </div>
        <div style={{ border: "1px solid #e5e7eb", padding: 15, borderRadius: 8 }}>
          <h3 style={{ color: "#16a34a", marginTop: 0, fontSize: 14, fontWeight: "bold" }}>BUYER / RECEIVER</h3>
          <p style={{ margin: "5px 0", fontWeight: "bold" }}>{inputs.buyer_company || "Buyer Company Name"}</p>
          <p style={{ margin: "3px 0", fontSize: 13, whiteSpace: "pre-line" }}>{inputs.buyer_address || "Buyer Address"}</p>
        </div>
      </div>
      <div style={{ marginBottom: 20 }}>
        <div><strong>Credit Note No:</strong> CN{docIds.Number3}</div>
        <div><strong>Date:</strong> {currentDate}</div>
        <div><strong>Reference Invoice:</strong> {docIds.invoiceNumber}</div>
      </div>
      <div style={{ marginBottom: 20, fontSize: 13 }}>
        <p><strong>Reason for Credit Note:</strong></p>
        <p>Price Discount</p>
      </div>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, marginBottom: 20 }}>
        <thead>
          <tr style={{ background: "#16a34a", color: "white" }}>
            <th style={{ border: "1px solid #16a34a", padding: 10, textAlign: "left" }}>Description</th>
            <th style={{ border: "1px solid #16a34a", padding: 10, textAlign: "right" }}>Amount ({inputs.currency || "USD"})</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ border: "1px solid #e5e7eb", padding: 8 }}>Total Credit Amount</td>
            <td style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "right" }}>{inputs.credit_note_amount || "0.00"}</td>
          </tr>
        </tbody>
      </table>
      <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: 15, fontSize: 11, color: "#666", textAlign: "right" }}>
        <p style={{ marginBottom: 40 }}><strong>For {company.company_name || "Company Name"}</strong></p>
      </div>
    </div>
  );
}

// ---- Debit Note ----
export function DebitNote({ company, inputs, docIds, currentDate }) {
  return (
    <div className="document-container" style={{ maxWidth: 800, margin: "0 auto", padding: 20, fontFamily: "Arial, sans-serif", background: "white" }}>
      <div style={{ textAlign: "center", borderBottom: "3px solid #16a34a", paddingBottom: 15, marginBottom: 20 }}>
        <h1 style={{ color: "#16a34a", margin: 0, fontSize: 28, fontWeight: "bold" }}>DEBIT NOTE</h1>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 30, marginBottom: 25 }}>
        <div style={{ border: "1px solid #e5e7eb", padding: 15, borderRadius: 8 }}>
          <h3 style={{ color: "#16a34a", marginTop: 0, fontSize: 14, fontWeight: "bold" }}>BILLER / ISSUER</h3>
          <p style={{ margin: "5px 0", fontWeight: "bold" }}>{company.company_name || "Company Name"}</p>
          <p style={{ margin: "3px 0", fontSize: 13 }}>{company.comp_reg_address || "Company Address"}</p>
        </div>
        <div style={{ border: "1px solid #e5e7eb", padding: 15, borderRadius: 8 }}>
          <h3 style={{ color: "#16a34a", marginTop: 0, fontSize: 14, fontWeight: "bold" }}>BUYER / RECEIVER</h3>
          <p style={{ margin: "5px 0", fontWeight: "bold" }}>{inputs.buyer_company || "Buyer Company Name"}</p>
          <p style={{ margin: "3px 0", fontSize: 13, whiteSpace: "pre-line" }}>{inputs.buyer_address || "Buyer Address"}</p>
        </div>
      </div>
      <div style={{ marginBottom: 20 }}>
        <div><strong>Debit Note No:</strong> DN{docIds.Number4}</div>
        <div><strong>Date:</strong> {currentDate}</div>
        <div><strong>Reference Invoice:</strong> {docIds.invoiceNumber}</div>
      </div>
      <div style={{ marginBottom: 20, fontSize: 13 }}>
        <p><strong>Reason for Debit Note:</strong></p>
        <p>Additional Freight Charges</p>
      </div>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, marginBottom: 20 }}>
        <thead>
          <tr style={{ background: "#16a34a", color: "white" }}>
            <th style={{ border: "1px solid #16a34a", padding: 10, textAlign: "left" }}>Description</th>
            <th style={{ border: "1px solid #16a34a", padding: 10, textAlign: "right" }}>Amount ({inputs.currency || "USD"})</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ border: "1px solid #e5e7eb", padding: 8 }}>Total Debit Amount</td>
            <td style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "right" }}>{inputs.debit_note_amount || "0.00"}</td>
          </tr>
        </tbody>
      </table>
      <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: 15, fontSize: 11, color: "#666", textAlign: "right" }}>
        <p style={{ marginBottom: 40 }}><strong>For {company.company_name || "Company Name"}</strong></p>
      </div>
    </div>
  );
}


export const generateDocuments = (selectedTemplates, companyData, userInputs) => {
  // Compute IDs and common date
  const docIds = buildDocIds();
  const currentDate = new Date().toLocaleDateString("en-GB");

  return selectedTemplates.map(template => {
    let htmlContent = '';
    let templateName = template.name || template.id;
    
    // Generate HTML directly for each template type
    switch (template.id) {
      case "commercial_invoice":
        htmlContent = generateCommercialInvoiceHTML(companyData, userInputs, docIds, currentDate);
        break;
      case "proforma_invoice":
        htmlContent = generateProformaInvoiceHTML(companyData, userInputs, docIds, currentDate);
        break;
      case "packing_list":
        htmlContent = generatePackingListHTML(companyData, userInputs, docIds, currentDate);
        break;
      case "delivery_challan":
        htmlContent = generateDeliveryChallanHTML(companyData, userInputs, docIds, currentDate);
        break;
      case "credit_note":
        htmlContent = generateCreditNoteHTML(companyData, userInputs, docIds, currentDate);
        break;
      case "debit_note":
        htmlContent = generateDebitNoteHTML(companyData, userInputs, docIds, currentDate);
        break;
      default:
        htmlContent = `
          <div style="padding: 20px; text-align: center;">
            <h2>Template "${template.id}" not found</h2>
            <p>Please contact support to add this template.</p>
          </div>
        `;
    }
    
    return {
      id: template.id,
      name: templateName,
      html: htmlContent
    };
  });
};

// HTML generation functions for each template
const generateCommercialInvoiceHTML = (company, inputs, docIds, currentDate) => {
  const products = parseProducts(inputs.products);
  const totals = calculateTotals(products, inputs.currency);

  return `
    <div class="document-container" style="max-width: 800px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif; background: white;">
      <div style="text-align: center; border-bottom: 3px solid #16a34a; padding-bottom: 15px; margin-bottom: 20px;">
        <h1 style="color: #16a34a; margin: 0; font-size: 28px; font-weight: bold;">COMMERCIAL INVOICE</h1>
      </div>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 25px;">
        <div style="border: 1px solid #e5e7eb; padding: 15px; border-radius: 8px;">
          <h3 style="color: #16a34a; margin-top: 0; font-size: 14px; font-weight: bold;">EXPORTER / SELLER</h3>
          <p style="margin: 5px 0; font-weight: bold;">${company?.company_name || "Company Name"}</p>
          <p style="margin: 3px 0; font-size: 13px;">${company?.comp_reg_address || "Company Address"}</p>
        </div>
        <div style="border: 1px solid #e5e7eb; padding: 15px; border-radius: 8px;">
          <h3 style="color: #16a34a; margin-top: 0; font-size: 14px; font-weight: bold;">BUYER / CONSIGNEE</h3>
          <p style="margin: 5px 0; font-weight: bold;">${inputs.buyer_company || "Buyer Company Name"}</p>
          <p style="margin: 3px 0; font-size: 13px; white-space: pre-line;">${inputs.buyer_address || "Buyer Address"}</p>
        </div>
      </div>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 25px;">
        <div>
          <div style="margin-bottom: 8px;"><strong>Invoice No:</strong> ${docIds.invoiceNumber}</div>
          <div style="margin-bottom: 8px;"><strong>Date:</strong> ${currentDate}</div>
          <div><strong>Currency:</strong> ${inputs.currency || 'USD'}</div>
        </div>
        <div>
          <div style="margin-bottom: 8px;"><strong>Port of Loading:</strong> ${inputs.port_loading || 'Port of Loading'}</div>
          <div style="margin-bottom: 8px;"><strong>Port of Discharge:</strong> ${inputs.port_discharge || 'Port of Discharge'}</div>
          <div><strong>Mode of Transport:</strong> ${inputs.transport_mode || 'Transport Mode'}</div>
        </div>
      </div>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 13px;">
        <thead>
          <tr style="background: #16a34a; color: white;">
            <th style="border: 1px solid #16a34a; padding: 10px; text-align: left; width: 8%;">S.No</th>
            <th style="border: 1px solid #16a34a; padding: 10px; text-align: left; width: 25%;">Item</th>
            <th style="border: 1px solid #16a34a; padding: 10px; text-align: left; width: 35%;">Description</th>
            <th style="border: 1px solid #16a34a; padding: 10px;">HS Code</th>
            <th style="border: 1px solid #16a34a; padding: 10px; text-align: center; width: 10%;">Qty</th>
            <th style="border: 1px solid #16a34a; padding: 10px; text-align: right; width: 12%;">Unit Price</th>
            <th style="border: 1px solid #16a34a; padding: 10px; text-align: right; width: 15%;">Amount</th>
          </tr>
        </thead>
        <tbody>
          ${products.map(product => `
            <tr>
              <td style="border: 1px solid #e5e7eb; padding: 8px; text-align: center;">${product.sno}</td>
              <td style="border: 1px solid #e5e7eb; padding: 8px;">${product.item}</td>
              <td style="border: 1px solid #e5e7eb; padding: 8px;">${product.description}</td>
              <td style="border: 1px solid #e5e7eb; padding: 8px;">${product.hsCode || ""}</td>
              <td style="border: 1px solid #e5e7eb; padding: 8px; text-align: center;">${product.quantity}</td>
              <td style="border: 1px solid #e5e7eb; padding: 8px; text-align: right;">${totals.currency} ${product.unitPrice.toFixed(2)}</td>
              <td style="border: 1px solid #e5e7eb; padding: 8px; text-align: right;">${totals.currency} ${product.amount.toFixed(2)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      <div style="display: flex; justify-content: flex-end; margin-bottom: 30px;">
        <div style="border: 2px solid #16a34a; padding: 15px; border-radius: 8px; min-width: 250px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 16px;">
            <strong>Total Amount:</strong>
            <strong>${totals.currency} ${totals.subtotal}</strong>
          </div>
          <div style="font-size: 12px; color: #666; text-align: center;">
            (${inputs.transport_mode || "FOB"} - ${inputs.port_loading || "Port of Loading"})
          </div>
        </div>
      </div>
      <div style="border-top: 1px solid #e5e7eb; padding-top: 15px; font-size: 11px; color: #666;">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
          <div>
            <p><strong>Terms & Conditions:</strong></p>
            <ul style="margin: 5px 0; padding-left: 15px;">
              <li>Payment: As per agreement</li>
              <li>Delivery: ${inputs.transport_mode || "As specified"}</li>
            </ul>
          </div>
          <div style="text-align: right;">
            <p style="margin-bottom: 40px;"><strong>For ${company?.company_name || "Company Name"}</strong></p>
          </div>
        </div>
      </div>
    </div>
  `;
};

const generateProformaInvoiceHTML = (company, inputs, docIds, currentDate) => {
  // Proforma replaces header and invoice number prefix
  const proformaIds = { ...docIds, invoiceNumber: `PI${docIds.Number1}` };
  return generateCommercialInvoiceHTML(company, inputs, proformaIds, currentDate)
    .replace('COMMERCIAL INVOICE', 'PROFORMA INVOICE');
};

const generatePackingListHTML = (company, inputs, docIds, currentDate) => {
  const products = parseProducts(inputs.products);
  const totalNet = products.reduce((sum, p) => sum + (p.quantity * 10), 0).toFixed(1);
  const totalGross = products.reduce((sum, p) => sum + (p.quantity * 12), 0).toFixed(1);

  return `
    <div class="document-container" style="max-width: 800px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif; background: white;">
      <div style="text-align: center; border-bottom: 3px solid #16a34a; padding-bottom: 15px; margin-bottom: 20px;">
        <h1 style="color: #16a34a; margin: 0; font-size: 28px; font-weight: bold;">PACKING LIST</h1>
      </div>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 25px;">
        <div style="border: 1px solid #e5e7eb; padding: 15px; border-radius: 8px;">
          <h3 style="color: #16a34a; margin-top: 0; font-size: 14px; font-weight: bold;">EXPORTER / SELLER</h3>
          <p style="margin: 5px 0; font-weight: bold;">${company?.company_name || "Company Name"}</p>
          <p style="margin: 3px 0; font-size: 13px;">${company?.comp_reg_address || "Company Address"}</p>
        </div>
        <div style="border: 1px solid #e5e7eb; padding: 15px; border-radius: 8px;">
          <h3 style="color: #16a34a; margin-top: 0; font-size: 14px; font-weight: bold;">BUYER / CONSIGNEE</h3>
          <p style="margin: 5px 0; font-weight: bold;">${inputs.buyer_company || "Buyer Company Name"}</p>
          <p style="margin: 3px 0; font-size: 13px; white-space: pre-line;">${inputs.buyer_address || "Buyer Address"}</p>
        </div>
      </div>
      <div style="margin-bottom: 25px;">
        <div><strong>Packing List No:</strong> PL${Date.now()}</div>
        <div><strong>Date:</strong> ${currentDate}</div>
        <div><strong>Invoice Reference:</strong> ${docIds.invoiceNumber}</div>
      </div>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 13px;">
        <thead>
          <tr style="background: #16a34a; color: white;">
            <th style="border: 1px solid #16a34a; padding: 10px;">Package No.</th>
            <th style="border: 1px solid #16a34a; padding: 10px;">Item Description</th>
            <th style="border: 1px solid #16a34a; padding: 10px;">HS Code</th>
            <th style="border: 1px solid #16a34a; padding: 10px;">Quantity</th>
            <th style="border: 1px solid #16a34a; padding: 10px;">Net Weight (Kg)</th>
            <th style="border: 1px solid #16a34a; padding: 10px;">Gross Weight (Kg)</th>
          </tr>
        </thead>
        <tbody>
          ${products.map((product, index) => `
            <tr>
              <td style="border: 1px solid #e5e7eb; padding: 8px;">PKG-${String(index + 1).padStart(3, "0")}</td>
              <td style="border: 1px solid #e5e7eb; padding: 8px;">${product.item} - ${product.description}</td>
              <td style="border: 1px solid #e5e7eb; padding: 8px; text-align: center;">${product.hsCode || ""}</td>
              <td style="border: 1px solid #e5e7eb; padding: 8px; text-align: center;">${product.quantity}</td>
              <td style="border: 1px solid #e5e7eb; padding: 8px; text-align: center;">${(product.quantity * 10).toFixed(1)}</td>
              <td style="border: 1px solid #e5e7eb; padding: 8px; text-align: center;">${(product.quantity * 12).toFixed(1)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      <div style="border: 1px solid #e5e7eb; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
        <h3 style="color: #16a34a; margin-top: 0;">Shipment Summary</h3>
        <div><strong>Total Packages:</strong> ${products.length}</div>
        <div><strong>Total Net Weight:</strong> ${totalNet} Kg</div>
        <div><strong>Total Gross Weight:</strong> ${totalGross} Kg</div>
      </div>
      <div style="border-top: 1px solid #e5e7eb; padding-top: 15px; font-size: 11px; color: #666; text-align: right;">
        <p style="margin-bottom: 40px;"><strong>For ${company?.company_name || "Company Name"}</strong></p>
      </div>
    </div>
  `;
};

const generateDeliveryChallanHTML = (company, inputs, docIds, currentDate) => {
  const products = parseProducts(inputs.products);
  
  return `
    <div class="document-container" style="max-width: 800px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif; background: white;">
      <div style="text-align: center; border-bottom: 3px solid #16a34a; padding-bottom: 15px; margin-bottom: 20px;">
        <h1 style="color: #16a34a; margin: 0; font-size: 28px; font-weight: bold;">DELIVERY CHALLAN</h1>
      </div>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 25px;">
        <div style="border: 1px solid #e5e7eb; padding: 15px; border-radius: 8px;">
          <h3 style="color: #16a34a; margin-top: 0; font-size: 14px; font-weight: bold;">EXPORTER / SELLER</h3>
          <p style="margin: 5px 0; font-weight: bold;">${company?.company_name || "Company Name"}</p>
          <p style="margin: 3px 0; font-size: 13px;">${company?.comp_reg_address || "Company Address"}</p>
        </div>
        <div style="border: 1px solid #e5e7eb; padding: 15px; border-radius: 8px;">
          <h3 style="color: #16a34a; margin-top: 0; font-size: 14px; font-weight: bold;">DELIVERY TO</h3>
          <p style="margin: 5px 0; font-weight: bold;">${inputs.buyer_company || "Buyer Company Name"}</p>
          <p style="margin: 3px 0; font-size: 13px; white-space: pre-line;">${inputs.buyer_address || "Buyer Address"}</p>
        </div>
      </div>
      <div style="margin-bottom: 20px;">
        <div><strong>Challan No:</strong> DC${docIds.Number2}</div>
        <div><strong>Date:</strong> ${currentDate}</div>
        <div><strong>Invoice Reference:</strong> ${docIds.invoiceNumber}</div>
      </div>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 13px;">
        <thead>
          <tr style="background: #16a34a; color: white;">
            <th style="border: 1px solid #16a34a; padding: 10px;">S. No.</th>
            <th style="border: 1px solid #16a34a; padding: 10px;">Description of Goods</th>
            <th style="border: 1px solid #16a34a; padding: 10px;">Quantity</th>
            <th style="border: 1px solid #16a34a; padding: 10px;">Unit</th>
          </tr>
        </thead>
        <tbody>
          ${products.map(product => `
            <tr>
              <td style="border: 1px solid #e5e7eb; padding: 8px;">${product.sno}</td>
              <td style="border: 1px solid #e5e7eb; padding: 8px;">${product.item} - ${product.description}</td>
              <td style="border: 1px solid #e5e7eb; padding: 8px; text-align: center;">${product.quantity}</td>
              <td style="border: 1px solid #e5e7eb; padding: 8px; text-align: center;">Nos</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      <div style="font-size: 11px; color: #666;">
        <p><strong>Note:</strong> Delivery is subject to the terms and conditions agreed upon in the contract.</p>
      </div>
      <div style="border-top: 1px solid #e5e7eb; padding-top: 15px; font-size: 11px; color: #666; text-align: right;">
        <p style="margin-bottom: 40px;"><strong>For ${company?.company_name || "Company Name"}</strong></p>
      </div>
    </div>
  `;
};

const generateCreditNoteHTML = (company, inputs, docIds, currentDate) => {
  return `
    <div class="document-container" style="max-width: 800px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif; background: white;">
      <div style="text-align: center; border-bottom: 3px solid #16a34a; padding-bottom: 15px; margin-bottom: 20px;">
        <h1 style="color: #16a34a; margin: 0; font-size: 28px; font-weight: bold;">CREDIT NOTE</h1>
      </div>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 25px;">
        <div style="border: 1px solid #e5e7eb; padding: 15px; border-radius: 8px;">
          <h3 style="color: #16a34a; margin-top: 0; font-size: 14px; font-weight: bold;">SELLER / ISSUER</h3>
          <p style="margin: 5px 0; font-weight: bold;">${company?.company_name || "Company Name"}</p>
          <p style="margin: 3px 0; font-size: 13px;">${company?.comp_reg_address || "Company Address"}</p>
        </div>
        <div style="border: 1px solid #e5e7eb; padding: 15px; border-radius: 8px;">
          <h3 style="color: #16a34a; margin-top: 0; font-size: 14px; font-weight: bold;">BUYER / RECEIVER</h3>
          <p style="margin: 5px 0; font-weight: bold;">${inputs.buyer_company || "Buyer Company Name"}</p>
          <p style="margin: 3px 0; font-size: 13px; white-space: pre-line;">${inputs.buyer_address || "Buyer Address"}</p>
        </div>
      </div>
      <div style="margin-bottom: 20px;">
        <div><strong>Credit Note No:</strong> CN${docIds.Number3}</div>
        <div><strong>Date:</strong> ${currentDate}</div>
        <div><strong>Reference Invoice:</strong> ${docIds.invoiceNumber}</div>
      </div>
      <div style="margin-bottom: 20px; font-size: 13px;">
        <p><strong>Reason for Credit Note:</strong></p>
        <p>Price Discount</p>
      </div>
      <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 20px;">
        <thead>
          <tr style="background: #16a34a; color: white;">
            <th style="border: 1px solid #16a34a; padding: 10px; text-align: left;">Description</th>
            <th style="border: 1px solid #16a34a; padding: 10px; text-align: right;">Amount (${inputs.currency || "USD"})</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="border: 1px solid #e5e7eb; padding: 8px;">Total Credit Amount</td>
            <td style="border: 1px solid #e5e7eb; padding: 8px; text-align: right;">${inputs.credit_note_amount || "0.00"}</td>
          </tr>
        </tbody>
      </table>
      <div style="border-top: 1px solid #e5e7eb; padding-top: 15px; font-size: 11px; color: #666; text-align: right;">
        <p style="margin-bottom: 40px;"><strong>For ${company?.company_name || "Company Name"}</strong></p>
      </div>
    </div>
  `;
};

const generateDebitNoteHTML = (company, inputs, docIds, currentDate) => {
  return `
    <div class="document-container" style="max-width: 800px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif; background: white;">
      <div style="text-align: center; border-bottom: 3px solid #16a34a; padding-bottom: 15px; margin-bottom: 20px;">
        <h1 style="color: #16a34a; margin: 0; font-size: 28px; font-weight: bold;">DEBIT NOTE</h1>
      </div>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 25px;">
        <div style="border: 1px solid #e5e7eb; padding: 15px; border-radius: 8px;">
          <h3 style="color: #16a34a; margin-top: 0; font-size: 14px; font-weight: bold;">BILLER / ISSUER</h3>
          <p style="margin: 5px 0; font-weight: bold;">${company?.company_name || "Company Name"}</p>
          <p style="margin: 3px 0; font-size: 13px;">${company?.comp_reg_address || "Company Address"}</p>
        </div>
        <div style="border: 1px solid #e5e7eb; padding: 15px; border-radius: 8px;">
          <h3 style="color: #16a34a; margin-top: 0; font-size: 14px; font-weight: bold;">BUYER / RECEIVER</h3>
          <p style="margin: 5px 0; font-weight: bold;">${inputs.buyer_company || "Buyer Company Name"}</p>
          <p style="margin: 3px 0; font-size: 13px; white-space: pre-line;">${inputs.buyer_address || "Buyer Address"}</p>
        </div>
      </div>
      <div style="margin-bottom: 20px;">
        <div><strong>Debit Note No:</strong> DN${docIds.Number4}</div>
        <div><strong>Date:</strong> ${currentDate}</div>
        <div><strong>Reference Invoice:</strong> ${docIds.invoiceNumber}</div>
      </div>
      <div style="margin-bottom: 20px; font-size: 13px;">
        <p><strong>Reason for Debit Note:</strong></p>
        <p>Additional Freight Charges</p>
      </div>
      <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 20px;">
        <thead>
          <tr style="background: #16a34a; color: white;">
            <th style="border: 1px solid #16a34a; padding: 10px; text-align: left;">Description</th>
            <th style="border: 1px solid #16a34a; padding: 10px; text-align: right;">Amount (${inputs.currency || "USD"})</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="border: 1px solid #e5e7eb; padding: 8px;">Total Debit Amount</td>
            <td style="border: 1px solid #e5e7eb; padding: 8px; text-align: right;">${inputs.debit_note_amount || "0.00"}</td>
          </tr>
        </tbody>
      </table>
      <div style="border-top: 1px solid #e5e7eb; padding-top: 15px; font-size: 11px; color: #666; text-align: right;">
        <p style="margin-bottom: 40px;"><strong>For ${company?.company_name || "Company Name"}</strong></p>
      </div>
    </div>
  `;
};
