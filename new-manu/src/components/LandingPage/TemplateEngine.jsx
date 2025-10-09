// src/utils/TemplateEngine.jsx
import React from "react";

/**
 * TemplateEngine.jsx
 * Production-ready export document templates:
 * - CommercialInvoice
 * - ProformaInvoice
 * - PackingList
 * - DeliveryChallan
 * - CreditNote
 * - DebitNote
 *
 * Inline styling, corporate blue-gray palette, autofill logic,
 * signature/placeholders, print-ready layout.
 */

/* ---------------- utils ---------------- */

const getRandomTwoDigits = () => String(Math.floor(Math.random() * 100)).padStart(2, "0");

export const buildDocIds = () => {
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
    Number4: `/${year}${month}/00${getRandomTwoDigits()}`,
  };
};

const esc = (v) => (v === undefined || v === null ? "" : String(v));

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
      amount: (parseFloat(p.quantity) || 0) * (parseFloat(p.unitPrice) || 0),
    }));
  }
  const lines = productInput.split("\n").filter((line) => line.trim());
  return lines
    .map((line, index) => {
      const parts = line.split("|").map((part) => part.trim());
      return {
        sno: index + 1,
        item: parts[0] || "",
        description: parts[1] || "",
        hsCode: parts[2] || "",
        quantity: parseFloat(parts[3]) || 0,
        unitPrice: parseFloat(parts[4]) || 0,
        amount: (parseFloat(parts[3]) || 0) * (parseFloat(parts[4]) || 0),
      };
    })
    .filter(Boolean);
};

const calculateTotals = (products, currency = "USD") => {
  const subtotal = products.reduce((sum, product) => sum + (product.amount || 0), 0);
  return {
    subtotal: subtotal.toFixed(2),
    currency,
  };
};

/* Autofill realistic defaults for missing fields */
const autofillInputs = (inputs = {}, docIds = {}) => {
  const result = { ...inputs };
  result.port_loading = esc(result.port_loading) || "Nhava Sheva (JNPT)";
  result.port_discharge = esc(result.port_discharge) || "Port of Rotterdam";
  result.transport_mode = esc(result.transport_mode) || "Sea";
  result.method_of_dispatch = esc(result.method_of_dispatch) || result.transport_mode || "Sea";
  result.type_of_shipment = esc(result.type_of_shipment) || "Full Container Load (FCL)";
  result.country_of_origin = esc(result.country_of_origin) || "India";
  result.country_of_final_destination = esc(result.country_of_final_destination) || result.port_discharge || "Unknown";
  result.vessel = esc(result.vessel) || `MV ${result.port_loading.split(" ")[0] || "Ocean"} Express`;
  result.voyage_number = esc(result.voyage_number) || `VY${getRandomTwoDigits()}`;
  result.bill_of_lading = esc(result.bill_of_lading) || `BL${docIds.Number?.replace(/\//g, "") || getRandomTwoDigits()}`;
  result.letter_of_credit = esc(result.letter_of_credit) || ""; // keep optional
  result.bank_details = esc(result.bank_details) || "Bank: Example Bank • A/C: 12345678 • SWIFT: EXAMPINBB";
  result.buyer_reference = esc(result.buyer_reference) || `Ref-${docIds.invoiceNumber}`;
  result.delivery_date = esc(result.delivery_date) || new Date().toISOString().slice(0, 10);
  // credit/debit amounts default 0
  result.credit_note_amount = result.credit_note_amount ?? "";
  result.debit_note_amount = result.debit_note_amount ?? "";
  return result;
};

/* ---------------- shared styles & palette ---------------- */

const colors = {
  textPrimary: "#0F172A", // dark slate
  textSecondary: "#475569", // slate gray
  accent: "#2563EB", // blue accent
  border: "#CBD5E1", // border gray
  headerBg: "#F1F5F9", // light header bg
  bgSoft: "#F8FAFC",
};

const containerBase = {
  maxWidth: 820,
  margin: "0 auto",
  padding: 22,
  fontFamily: "Arial, Helvetica, sans-serif",
  background: "white",
  color: colors.textPrimary,
  lineHeight: 1.4,
  boxSizing: "border-box",
};

const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  borderBottom: `2px solid ${colors.border}`,
  paddingBottom: 12,
  marginBottom: 18,
};

const docTitleStyle = {
  margin: 0,
  fontSize: 20,
  fontWeight: 700,
  letterSpacing: 0.4,
  color: colors.textPrimary,
};

const infoBoxStyle = {
  border: `1px solid ${colors.border}`,
  padding: 12,
  borderRadius: 6,
  background: "#fff",
};

const gridTwo = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 24,
  marginBottom: 18,
};

/* ---------------- React components ---------------- */

/* 1) Commercial Invoice */
export function CommercialInvoice({ company = {}, inputs = {}, docIds = buildDocIds(), currentDate = new Date().toLocaleDateString("en-GB") }) {
  const filled = autofillInputs(inputs, docIds);
  const products = parseProducts(filled.products);
  const totals = calculateTotals(products, filled.currency || "USD");

  return (
    <div className="document-container" style={containerBase}>
      {/* Header */}
      <div style={headerStyle}>
        <div>
          <div style={{ fontSize: 12, color: colors.textSecondary, fontWeight: 700 }}>{company.company_name || "Company Name"}</div>
          <div style={{ fontSize: 11, color: colors.textSecondary, whiteSpace: "pre-line" }}>{company.comp_reg_address || "Company registered address"}</div>
          {company.gstin && <div style={{ fontSize: 11, color: colors.textSecondary, marginTop: 6 }}>GSTIN: {company.gstin}</div>}
        </div>

        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 12, color: colors.textSecondary }}>Document</div>
          <h1 style={docTitleStyle}>COMMERCIAL INVOICE</h1>
          <div style={{ fontSize: 12, color: colors.textSecondary }}>{docIds.invoiceNumber}</div>
        </div>
      </div>

      {/* Parties */}
      <section style={gridTwo}>
        <div style={infoBoxStyle}>
          <div style={{ fontSize: 12, fontWeight: 700, color: colors.textPrimary, marginBottom: 8 }}>EXPORTER / SELLER</div>
          <div style={{ fontSize: 13, fontWeight: 700 }}>{company.company_name || "Company Name"}</div>
          <div style={{ fontSize: 12, color: colors.textSecondary, whiteSpace: "pre-line" }}>{company.comp_reg_address || "Company Address"}</div>
        </div>

        <div style={infoBoxStyle}>
          <div style={{ fontSize: 12, fontWeight: 700, color: colors.textPrimary, marginBottom: 8 }}>BUYER / CONSIGNEE</div>
          <div style={{ fontSize: 13, fontWeight: 700 }}>{filled.buyer_company || "Buyer Company"}</div>
          <div style={{ fontSize: 12, color: colors.textSecondary, whiteSpace: "pre-line" }}>{filled.buyer_address || "Buyer Address"}</div>
        </div>
      </section>

      {/* Meta */}
      <section style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 14 }}>
        <div>
          <div style={{ marginBottom: 6 }}><strong style={{ color: colors.textSecondary, width: 120, display: "inline-block" }}>Invoice No:</strong> {docIds.invoiceNumber}</div>
          <div style={{ marginBottom: 6 }}><strong style={{ color: colors.textSecondary, width: 120, display: "inline-block" }}>Date:</strong> {currentDate}</div>
          <div><strong style={{ color: colors.textSecondary, width: 120, display: "inline-block" }}>Currency:</strong> {filled.currency || "USD"}</div>
        </div>

        <div>
          <div style={{ marginBottom: 6 }}><strong style={{ color: colors.textSecondary, width: 140, display: "inline-block" }}>Port of Loading:</strong> {filled.port_loading}</div>
          <div style={{ marginBottom: 6 }}><strong style={{ color: colors.textSecondary, width: 140, display: "inline-block" }}>Port of Discharge:</strong> {filled.port_discharge}</div>
          <div><strong style={{ color: colors.textSecondary, width: 140, display: "inline-block" }}>Mode of Transport:</strong> {filled.transport_mode}</div>
        </div>
      </section>

      {/* Shipment details row (full width) */}
      <div style={{ marginBottom: 14, fontSize: 12, color: colors.textSecondary }}>
        <div style={{ marginBottom: 6 }}><strong>Vessel / Aircraft:</strong> {filled.vessel} &nbsp;&nbsp; <strong>Voyage No:</strong> {filled.voyage_number}</div>
        <div style={{ marginBottom: 6 }}><strong>Bill of Lading No:</strong> {filled.bill_of_lading} &nbsp;&nbsp; <strong>Country of Origin:</strong> {filled.country_of_origin}</div>
        <div><strong>Country of Final Destination:</strong> {filled.country_of_final_destination}</div>
      </div>

      {/* Products table */}
      <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 14, fontSize: 13 }}>
        <thead>
          <tr style={{ background: colors.headerBg }}>
            <th style={{ border: `1px solid ${colors.border}`, padding: 10, textAlign: "left", width: "6%" }}>S.No</th>
            <th style={{ border: `1px solid ${colors.border}`, padding: 10, textAlign: "left", width: "20%" }}>Product Code / Item</th>
            <th style={{ border: `1px solid ${colors.border}`, padding: 10, textAlign: "left", width: "36%" }}>Description</th>
            <th style={{ border: `1px solid ${colors.border}`, padding: 10, textAlign: "center", width: "10%" }}>HS Code</th>
            <th style={{ border: `1px solid ${colors.border}`, padding: 10, textAlign: "center", width: "8%" }}>Qty</th>
            <th style={{ border: `1px solid ${colors.border}`, padding: 10, textAlign: "right", width: "10%" }}>Unit Price</th>
            <th style={{ border: `1px solid ${colors.border}`, padding: 10, textAlign: "right", width: "10%" }}>Amount</th>
          </tr>
        </thead>
        <tbody>
          {products.length === 0 && (
            <tr>
              <td colSpan={7} style={{ textAlign: "center", padding: 18, border: `1px solid ${colors.border}`, color: colors.textSecondary }}>No products specified</td>
            </tr>
          )}
          {products.map((p) => (
            <tr key={p.sno}>
              <td style={{ border: `1px solid ${colors.border}`, padding: 8, textAlign: "center" }}>{p.sno}</td>
              <td style={{ border: `1px solid ${colors.border}`, padding: 8 }}>{p.item || "-"}</td>
              <td style={{ border: `1px solid ${colors.border}`, padding: 8 }}>{p.description || "-"}</td>
              <td style={{ border: `1px solid ${colors.border}`, padding: 8, textAlign: "center" }}>{p.hsCode || "-"}</td>
              <td style={{ border: `1px solid ${colors.border}`, padding: 8, textAlign: "center" }}>{p.quantity}</td>
              <td style={{ border: `1px solid ${colors.border}`, padding: 8, textAlign: "right" }}>{(filled.currency || "USD")} {Number(p.unitPrice || 0).toFixed(2)}</td>
              <td style={{ border: `1px solid ${colors.border}`, padding: 8, textAlign: "right" }}>{(filled.currency || "USD")} {Number(p.amount || 0).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals / Declaration / Signature */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 }}>
        <div style={{ width: "60%", fontSize: 12, color: colors.textSecondary }}>
          <div style={{ fontWeight: 700, color: colors.textPrimary, marginBottom: 6 }}>Declaration</div>
          <div>We hereby declare that the particulars given above are true and correct. Goods are of origin as stated and are packed, marked and labelled as per contract.</div>
          <div style={{ marginTop: 12, fontSize: 11 }}><strong>Bank Details:</strong> {filled.bank_details}</div>
          <div style={{ marginTop: 12, fontSize: 11, color: colors.textSecondary }}><strong>Incoterms®:</strong> {filled.incoterms || "Incoterms 2020"}</div>
        </div>

        <div style={{ width: "36%" }}>
          <div style={{ border: `1px solid ${colors.border}`, borderRadius: 6, padding: 12, background: "#fff" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <strong style={{ color: colors.textPrimary }}>Total Amount</strong>
              <strong style={{ color: colors.textPrimary }}>{filled.currency || "USD"} {totals.subtotal}</strong>
            </div>
            <div style={{ fontSize: 12, color: colors.textSecondary, textAlign: "center" }}>({filled.transport_mode || "FOB"} - {filled.port_loading})</div>
          </div>

          {/* Signature area */}
          <div style={{ marginTop: 18, textAlign: "right" }}>
            <div style={{ marginBottom: 36 }}>For {company.company_name || "Company Name"}</div>
            <div style={{ height: 48, borderTop: `1px solid ${colors.border}`, width: 220, marginLeft: "auto" }}></div>
            <div style={{ marginTop: 6, fontSize: 12, color: colors.textSecondary }}>Authorized Signatory</div>
            <div style={{ marginTop: 8, fontSize: 11, color: colors.textSecondary }}>Signature & Company Seal</div>
          </div>
        </div>
      </div>

      {/* Footer declaration */}
      <footer style={{ borderTop: `1px solid ${colors.border}`, paddingTop: 10, fontSize: 11, color: colors.textSecondary }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div>{company.company_name ? `${company.company_name} • ${company.comp_reg_city || ""}` : ""}</div>
          <div>Document generated on {currentDate}</div>
        </div>
      </footer>
    </div>
  );
}

/* 2) Proforma Invoice (wraps Commercial with PI number) */
export function ProformaInvoice(props) {
  const { docIds = buildDocIds() } = props;
  const proformaIds = { ...docIds, invoiceNumber: `PI${docIds.Number1}` };
  return <CommercialInvoice {...props} docIds={proformaIds} />;
}

/* 3) Packing List */
export function PackingList({ company = {}, inputs = {}, docIds = buildDocIds(), currentDate = new Date().toLocaleDateString("en-GB") }) {
  const filled = autofillInputs(inputs, docIds);
  const products = parseProducts(filled.products);
  const totalNet = products.reduce((sum, p) => sum + (Number(p.quantity || 0) * 10), 0).toFixed(1);
  const totalGross = products.reduce((sum, p) => sum + (Number(p.quantity || 0) * 12), 0).toFixed(1);

  return (
    <div style={containerBase}>
      <div style={headerStyle}>
        <div>
          <div style={{ fontSize: 12, color: colors.textSecondary, fontWeight: 700 }}>{company.company_name || "Company Name"}</div>
          <div style={{ fontSize: 11, color: colors.textSecondary }}>{company.comp_reg_address || "Address"}</div>
        </div>

        <div style={{ textAlign: "right" }}>
          <h1 style={docTitleStyle}>PACKING LIST</h1>
          <div style={{ fontSize: 12, color: colors.textSecondary }}>PL/{docIds.Number2}</div>
        </div>
      </div>

      <section style={gridTwo}>
        <div style={infoBoxStyle}>
          <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 6 }}>EXPORTER / SELLER</div>
          <div style={{ fontSize: 13, fontWeight: 700 }}>{company.company_name || "Company Name"}</div>
          <div style={{ fontSize: 12, color: colors.textSecondary }}>{company.comp_reg_address || "Address"}</div>
        </div>

        <div style={infoBoxStyle}>
          <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 6 }}>BUYER / CONSIGNEE</div>
          <div style={{ fontSize: 13, fontWeight: 700 }}>{filled.buyer_company || "Buyer Company"}</div>
          <div style={{ fontSize: 12, color: colors.textSecondary, whiteSpace: "pre-line" }}>{filled.buyer_address || "Address"}</div>
        </div>
      </section>

      <div style={{ marginBottom: 12 }}>
        <div style={{ marginBottom: 4 }}><strong>Export Invoice No:</strong> {docIds.invoiceNumber}</div>
        <div style={{ marginBottom: 4 }}><strong>Date:</strong> {currentDate}</div>
        <div style={{ marginBottom: 4 }}><strong>Bill of Lading No:</strong> {filled.bill_of_lading}</div>
        <div style={{ marginBottom: 4 }}><strong>Method of Dispatch:</strong> {filled.method_of_dispatch}</div>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 12, fontSize: 13 }}>
        <thead>
          <tr style={{ background: colors.headerBg }}>
            <th style={{ border: `1px solid ${colors.border}`, padding: 10 }}>Product Code / Item</th>
            <th style={{ border: `1px solid ${colors.border}`, padding: 10 }}>Description</th>
            <th style={{ border: `1px solid ${colors.border}`, padding: 10, textAlign: "center" }}>Qty</th>
            <th style={{ border: `1px solid ${colors.border}`, padding: 10, textAlign: "center" }}>Kind & No of Packages</th>
            <th style={{ border: `1px solid ${colors.border}`, padding: 10, textAlign: "center" }}>Net Weight (Kg)</th>
            <th style={{ border: `1px solid ${colors.border}`, padding: 10, textAlign: "center" }}>Gross Weight (Kg)</th>
            <th style={{ border: `1px solid ${colors.border}`, padding: 10, textAlign: "center" }}>Measurements (m³)</th>
          </tr>
        </thead>
        <tbody>
          {products.length === 0 && (
            <tr>
              <td colSpan={7} style={{ textAlign: "center", padding: 18, border: `1px solid ${colors.border}`, color: colors.textSecondary }}>No packing lines</td>
            </tr>
          )}
          {products.map((p, i) => (
            <tr key={i}>
              <td style={{ border: `1px solid ${colors.border}`, padding: 8 }}>{p.item || "-"}</td>
              <td style={{ border: `1px solid ${colors.border}`, padding: 8 }}>{p.description || "-"}</td>
              <td style={{ border: `1px solid ${colors.border}`, padding: 8, textAlign: "center" }}>{p.quantity}</td>
              <td style={{ border: `1px solid ${colors.border}`, padding: 8, textAlign: "center" }}>{`PKG-${String(i + 1).padStart(3, "0")}`}</td>
              <td style={{ border: `1px solid ${colors.border}`, padding: 8, textAlign: "center" }}>{(p.quantity * 10).toFixed(1)}</td>
              <td style={{ border: `1px solid ${colors.border}`, padding: 8, textAlign: "center" }}>{(p.quantity * 12).toFixed(1)}</td>
              <td style={{ border: `1px solid ${colors.border}`, padding: 8, textAlign: "center" }}>{((p.quantity * 0.02) || 0).toFixed(3)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ border: `1px solid ${colors.border}`, padding: 12, borderRadius: 6, marginBottom: 12 }}>
        <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 8 }}>Shipment Summary</div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div>Total Packages: <strong>{products.length}</strong></div>
          <div>Total Net Weight: <strong>{totalNet} Kg</strong></div>
          <div>Total Gross Weight: <strong>{totalGross} Kg</strong></div>
        </div>
      </div>

      <div style={{ textAlign: "right" }}>
        <div>For {company.company_name || "Company Name"}</div>
        <div style={{ marginTop: 36, borderTop: `1px solid ${colors.border}`, width: 240, marginLeft: "auto" }}></div>
        <div style={{ fontSize: 11, color: colors.textSecondary }}>Authorized Signatory</div>
      </div>
    </div>
  );
}

/* 4) Delivery Challan */
export function DeliveryChallan({ company = {}, inputs = {}, docIds = buildDocIds(), currentDate = new Date().toLocaleDateString("en-GB") }) {
  const filled = autofillInputs(inputs, docIds);
  const products = parseProducts(filled.products);

  return (
    <div style={containerBase}>
      <div style={headerStyle}>
        <div>
          <div style={{ fontSize: 12, color: colors.textSecondary, fontWeight: 700 }}>{company.company_name || "Company Name"}</div>
          <div style={{ fontSize: 11, color: colors.textSecondary }}>{company.comp_reg_address || "Address"}</div>
        </div>

        <div style={{ textAlign: "right" }}>
          <h1 style={docTitleStyle}>DELIVERY CHALLAN</h1>
          <div style={{ fontSize: 12, color: colors.textSecondary }}>DC/{docIds.Number2}</div>
        </div>
      </div>

      <section style={gridTwo}>
        <div style={infoBoxStyle}>
          <div style={{ fontSize: 12, fontWeight: 700 }}>EXPORTER / SELLER</div>
          <div style={{ fontSize: 13, fontWeight: 700 }}>{company.company_name || "Company Name"}</div>
          <div style={{ fontSize: 12, color: colors.textSecondary }}>{company.comp_reg_address || "Address"}</div>
        </div>

        <div style={infoBoxStyle}>
          <div style={{ fontSize: 12, fontWeight: 700 }}>DELIVERY TO</div>
          <div style={{ fontSize: 13, fontWeight: 700 }}>{filled.buyer_company || "Buyer Name"}</div>
          <div style={{ fontSize: 12, color: colors.textSecondary, whiteSpace: "pre-line" }}>{filled.buyer_address || "Address"}</div>
        </div>
      </section>

      <div style={{ marginBottom: 12 }}>
        <div style={{ marginBottom: 4 }}><strong>Challan No:</strong> DC{docIds.Number2}</div>
        <div style={{ marginBottom: 4 }}><strong>Date:</strong> {currentDate}</div>
        <div style={{ marginBottom: 4 }}><strong>Invoice Ref:</strong> {docIds.invoiceNumber}</div>
        <div style={{ marginBottom: 4 }}><strong>Method of Dispatch:</strong> {filled.method_of_dispatch}</div>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 12, fontSize: 13 }}>
        <thead>
          <tr style={{ background: colors.headerBg }}>
            <th style={{ border: `1px solid ${colors.border}`, padding: 10 }}>S. No.</th>
            <th style={{ border: `1px solid ${colors.border}`, padding: 10 }}>Description of Goods</th>
            <th style={{ border: `1px solid ${colors.border}`, padding: 10, textAlign: "center" }}>Quantity</th>
            <th style={{ border: `1px solid ${colors.border}`, padding: 10, textAlign: "center" }}>Unit</th>
          </tr>
        </thead>
        <tbody>
          {products.length === 0 && (
            <tr>
              <td colSpan={4} style={{ textAlign: "center", padding: 18, border: `1px solid ${colors.border}`, color: colors.textSecondary }}>No items</td>
            </tr>
          )}
          {products.map((p) => (
            <tr key={p.sno}>
              <td style={{ border: `1px solid ${colors.border}`, padding: 8, textAlign: "center" }}>{p.sno}</td>
              <td style={{ border: `1px solid ${colors.border}`, padding: 8 }}>{p.item} {p.description ? `- ${p.description}` : ""}</td>
              <td style={{ border: `1px solid ${colors.border}`, padding: 8, textAlign: "center" }}>{p.quantity}</td>
              <td style={{ border: `1px solid ${colors.border}`, padding: 8, textAlign: "center" }}>Nos</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ fontSize: 12, color: colors.textSecondary, marginBottom: 12 }}><strong>Note:</strong> Delivery is subject to the terms and conditions agreed upon in the contract.</div>

      <div style={{ textAlign: "right" }}>
        <div>For {company.company_name || "Company Name"}</div>
        <div style={{ marginTop: 36, borderTop: `1px solid ${colors.border}`, width: 220, marginLeft: "auto" }}></div>
        <div style={{ fontSize: 11, color: colors.textSecondary }}>Authorized Signatory</div>
      </div>
    </div>
  );
}

/* 5) Credit Note */
export function CreditNote({ company = {}, inputs = {}, docIds = buildDocIds(), currentDate = new Date().toLocaleDateString("en-GB") }) {
  const filled = autofillInputs(inputs, docIds);
  const creditAmount = Number(filled.credit_note_amount || 0).toFixed(2);

  return (
    <div style={containerBase}>
      <div style={headerStyle}>
        <div>
          <div style={{ fontSize: 12, color: colors.textSecondary, fontWeight: 700 }}>{company.company_name || "Company Name"}</div>
          <div style={{ fontSize: 11, color: colors.textSecondary }}>{company.comp_reg_address || "Address"}</div>
        </div>

        <div style={{ textAlign: "right" }}>
          <h1 style={docTitleStyle}>CREDIT NOTE</h1>
          <div style={{ fontSize: 12, color: colors.textSecondary }}>CN/{docIds.Number3}</div>
        </div>
      </div>

      <section style={gridTwo}>
        <div style={infoBoxStyle}>
          <div style={{ fontSize: 12, fontWeight: 700 }}>SELLER / ISSUER</div>
          <div style={{ fontSize: 13, fontWeight: 700 }}>{company.company_name || "Company"}</div>
          <div style={{ fontSize: 12, color: colors.textSecondary }}>{company.comp_reg_address || "Address"}</div>
        </div>

        <div style={infoBoxStyle}>
          <div style={{ fontSize: 12, fontWeight: 700 }}>BUYER / RECEIVER</div>
          <div style={{ fontSize: 13, fontWeight: 700 }}>{filled.buyer_company || "Buyer"}</div>
          <div style={{ fontSize: 12, color: colors.textSecondary }}>{filled.buyer_address || "Address"}</div>
        </div>
      </section>

      <div style={{ marginBottom: 12 }}>
        <div style={{ marginBottom: 4 }}><strong>Credit Note No:</strong> CN{docIds.Number3}</div>
        <div style={{ marginBottom: 4 }}><strong>Date:</strong> {currentDate}</div>
        <div style={{ marginBottom: 4 }}><strong>Reference Invoice:</strong> {docIds.invoiceNumber}</div>
      </div>

      <div style={{ fontSize: 13, marginBottom: 12 }}>
        <div><strong>Reason for Credit Note:</strong></div>
        <div style={{ color: colors.textSecondary }}>{filled.credit_reason || "Price Discount / Adjustment"}</div>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, marginBottom: 12 }}>
        <thead>
          <tr style={{ background: colors.headerBg }}>
            <th style={{ border: `1px solid ${colors.border}`, padding: 10, textAlign: "left" }}>Description</th>
            <th style={{ border: `1px solid ${colors.border}`, padding: 10, textAlign: "right" }}>Amount ({filled.currency || "USD"})</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ border: `1px solid ${colors.border}`, padding: 8 }}>Total Credit Amount</td>
            <td style={{ border: `1px solid ${colors.border}`, padding: 8, textAlign: "right" }}>{creditAmount}</td>
          </tr>
        </tbody>
      </table>

      <div style={{ textAlign: "right" }}>
        <div>For {company.company_name || "Company Name"}</div>
        <div style={{ marginTop: 36, borderTop: `1px solid ${colors.border}`, width: 220, marginLeft: "auto" }}></div>
        <div style={{ fontSize: 11, color: colors.textSecondary }}>Authorized Signatory</div>
      </div>
    </div>
  );
}

/* 6) Debit Note */
export function DebitNote({ company = {}, inputs = {}, docIds = buildDocIds(), currentDate = new Date().toLocaleDateString("en-GB") }) {
  const filled = autofillInputs(inputs, docIds);
  const debitAmount = Number(filled.debit_note_amount || 0).toFixed(2);

  return (
    <div style={containerBase}>
      <div style={headerStyle}>
        <div>
          <div style={{ fontSize: 12, color: colors.textSecondary, fontWeight: 700 }}>{company.company_name || "Company Name"}</div>
          <div style={{ fontSize: 11, color: colors.textSecondary }}>{company.comp_reg_address || "Address"}</div>
        </div>

        <div style={{ textAlign: "right" }}>
          <h1 style={docTitleStyle}>DEBIT NOTE</h1>
          <div style={{ fontSize: 12, color: colors.textSecondary }}>DN/{docIds.Number4}</div>
        </div>
      </div>

      <section style={gridTwo}>
        <div style={infoBoxStyle}>
          <div style={{ fontSize: 12, fontWeight: 700 }}>BILLER / ISSUER</div>
          <div style={{ fontSize: 13, fontWeight: 700 }}>{company.company_name || "Company"}</div>
          <div style={{ fontSize: 12, color: colors.textSecondary }}>{company.comp_reg_address || "Address"}</div>
        </div>

        <div style={infoBoxStyle}>
          <div style={{ fontSize: 12, fontWeight: 700 }}>BUYER / RECEIVER</div>
          <div style={{ fontSize: 13, fontWeight: 700 }}>{filled.buyer_company || "Buyer"}</div>
          <div style={{ fontSize: 12, color: colors.textSecondary }}>{filled.buyer_address || "Address"}</div>
        </div>
      </section>

      <div style={{ marginBottom: 12 }}>
        <div style={{ marginBottom: 4 }}><strong>Debit Note No:</strong> DN{docIds.Number4}</div>
        <div style={{ marginBottom: 4 }}><strong>Date:</strong> {currentDate}</div>
        <div style={{ marginBottom: 4 }}><strong>Reference Invoice:</strong> {docIds.invoiceNumber}</div>
      </div>

      <div style={{ fontSize: 13, marginBottom: 12 }}>
        <div><strong>Reason for Debit Note:</strong></div>
        <div style={{ color: colors.textSecondary }}>{filled.debit_reason || "Additional Freight Charges / Adjustment"}</div>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, marginBottom: 12 }}>
        <thead>
          <tr style={{ background: colors.headerBg }}>
            <th style={{ border: `1px solid ${colors.border}`, padding: 10, textAlign: "left" }}>Description</th>
            <th style={{ border: `1px solid ${colors.border}`, padding: 10, textAlign: "right" }}>Amount ({filled.currency || "USD"})</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ border: `1px solid ${colors.border}`, padding: 8 }}>Total Debit Amount</td>
            <td style={{ border: `1px solid ${colors.border}`, padding: 8, textAlign: "right" }}>{debitAmount}</td>
          </tr>
        </tbody>
      </table>

      <div style={{ textAlign: "right" }}>
        <div>For {company.company_name || "Company Name"}</div>
        <div style={{ marginTop: 36, borderTop: `1px solid ${colors.border}`, width: 220, marginLeft: "auto" }}></div>
        <div style={{ fontSize: 11, color: colors.textSecondary }}>Authorized Signatory</div>
      </div>
    </div>
  );
}

/* ---------------- HTML string generators (generateDocuments) ----------------
   These are handy if you need raw HTML blobs for server-side PDF generation (puppeteer/wkhtmltopdf).
   They follow the same polished layout used above.
*/
const styleHeader = (title, ref) => `
  <div style="display:flex;justify-content:space-between;align-items:flex-start;border-bottom:2px solid ${colors.border};padding-bottom:12px;margin-bottom:18px;">
    <div>
      <div style="font-size:12px;color:${colors.textSecondary};font-weight:700;">${esc(ref.company_name || "Company Name")}</div>
      <div style="font-size:11px;color:${colors.textSecondary};white-space:pre-line;">${esc(ref.comp_reg_address || "")}</div>
    </div>
    <div style="text-align:right;">
      <div style="font-size:12px;color:${colors.textSecondary}">Document</div>
      <h1 style="margin:0;font-size:20px;font-weight:700;color:${colors.textPrimary};">${title}</h1>
      <div style="font-size:12px;color:${colors.textSecondary};">${esc(ref.docRef || "")}</div>
    </div>
  </div>
`;

const productRowsHTML = (products, currency) =>
  products.length === 0
    ? `<tr><td colspan="7" style="text-align:center;padding:18px;border:1px solid ${colors.border};color:${colors.textSecondary}">No products specified</td></tr>`
    : products
      .map(
        (p) => `
    <tr>
      <td style="border:1px solid ${colors.border};padding:8px;text-align:center">${esc(p.sno)}</td>
      <td style="border:1px solid ${colors.border};padding:8px">${esc(p.item || "-")}</td>
      <td style="border:1px solid ${colors.border};padding:8px">${esc(p.description || "-")}</td>
      <td style="border:1px solid ${colors.border};padding:8px;text-align:center">${esc(p.hsCode || "-")}</td>
      <td style="border:1px solid ${colors.border};padding:8px;text-align:center">${esc(p.quantity)}</td>
      <td style="border:1px solid ${colors.border};padding:8px;text-align:right">${esc(currency)} ${Number(p.unitPrice || 0).toFixed(2)}</td>
      <td style="border:1px solid ${colors.border};padding:8px;text-align:right">${esc(currency)} ${Number(p.amount || 0).toFixed(2)}</td>
    </tr>
  `
      )
      .join("");

export const generateCommercialInvoiceHTML = (company = {}, inputs = {}, docIds = buildDocIds(), currentDate = new Date().toLocaleDateString("en-GB")) => {
  const filled = autofillInputs(inputs, docIds);
  const products = parseProducts(filled.products);
  const totals = calculateTotals(products, filled.currency || "USD");
  const header = styleHeader("COMMERCIAL INVOICE", { ...company, docRef: docIds.invoiceNumber });

  const rows = productRowsHTML(products, totals.currency);

  return `
  <div style="max-width:820px;margin:0 auto;padding:22px;font-family:Arial,Helvetica,sans-serif;background:white;color:${colors.textPrimary}">
    ${header}
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-bottom:18px">
      <div style="border:1px solid ${colors.border};padding:12px;border-radius:6px;">
        <div style="font-size:12px;font-weight:700;margin-bottom:8px">EXPORTER / SELLER</div>
        <div style="font-size:13px;font-weight:700">${esc(company.company_name || "")}</div>
        <div style="font-size:12px;color:${colors.textSecondary};white-space:pre-line">${esc(company.comp_reg_address || "")}</div>
      </div>
      <div style="border:1px solid ${colors.border};padding:12px;border-radius:6px;">
        <div style="font-size:12px;font-weight:700;margin-bottom:8px">BUYER / CONSIGNEE</div>
        <div style="font-size:13px;font-weight:700">${esc(filled.buyer_company || "")}</div>
        <div style="font-size:12px;color:${colors.textSecondary};white-space:pre-line">${esc(filled.buyer_address || "")}</div>
      </div>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-bottom:14px">
      <div>
        <div style="margin-bottom:6px"><strong style="color:${colors.textSecondary};display:inline-block;width:120px">Invoice No:</strong> ${esc(docIds.invoiceNumber)}</div>
        <div style="margin-bottom:6px"><strong style="color:${colors.textSecondary};display:inline-block;width:120px">Date:</strong> ${esc(currentDate)}</div>
        <div><strong style="color:${colors.textSecondary};display:inline-block;width:120px">Currency:</strong> ${esc(filled.currency || "USD")}</div>
      </div>
      <div>
        <div style="margin-bottom:6px"><strong style="color:${colors.textSecondary};display:inline-block;width:130px">Port of Loading:</strong> ${esc(filled.port_loading)}</div>
        <div style="margin-bottom:6px"><strong style="color:${colors.textSecondary};display:inline-block;width:130px">Port of Discharge:</strong> ${esc(filled.port_discharge)}</div>
        <div><strong style="color:${colors.textSecondary};display:inline-block;width:130px">Mode of Transport:</strong> ${esc(filled.transport_mode)}</div>
      </div>
    </div>

    <div style="margin-bottom:12px;font-size:12px;color:${colors.textSecondary}">
      <div style="margin-bottom:6px"><strong>Vessel / Aircraft:</strong> ${esc(filled.vessel)} &nbsp;&nbsp; <strong>Voyage No:</strong> ${esc(filled.voyage_number)}</div>
      <div style="margin-bottom:6px"><strong>Bill of Lading No:</strong> ${esc(filled.bill_of_lading)} &nbsp;&nbsp; <strong>Country of Origin:</strong> ${esc(filled.country_of_origin)}</div>
    </div>

    <table style="width:100%;border-collapse:collapse;margin-bottom:14px;font-size:13px">
      <thead>
        <tr style="background:${colors.headerBg}">
          <th style="border:1px solid ${colors.border};padding:10px;text-align:left;width:6%">S.No</th>
          <th style="border:1px solid ${colors.border};padding:10px;text-align:left;width:20%">Product Code / Item</th>
          <th style="border:1px solid ${colors.border};padding:10px;text-align:left;width:36%">Description</th>
          <th style="border:1px solid ${colors.border};padding:10px;text-align:center;width:10%">HS Code</th>
          <th style="border:1px solid ${colors.border};padding:10px;text-align:center;width:8%">Qty</th>
          <th style="border:1px solid ${colors.border};padding:10px;text-align:right;width:10%">Unit Price</th>
          <th style="border:1px solid ${colors.border};padding:10px;text-align:right;width:10%">Amount</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>

    <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:18px">
      <div style="width:60%;font-size:12px;color:${colors.textSecondary}">
        <div style="font-weight:700;color:${colors.textPrimary};margin-bottom:6px">Declaration</div>
        <div>We hereby declare that the particulars given above are true and correct and that the goods are of origin as stated.</div>
        <div style="margin-top:10px"><strong>Bank Details:</strong> ${esc(filled.bank_details)}</div>
      </div>
      <div style="width:36%">
        <div style="border:1px solid ${colors.border};padding:12px;border-radius:6px">
          <div style="display:flex;justify-content:space-between;margin-bottom:8px;font-weight:700">
            <div>Total</div>
            <div>${esc(filled.currency || "USD")} ${esc(totals.subtotal)}</div>
          </div>
          <div style="font-size:12px;color:${colors.textSecondary};text-align:center">(${esc(filled.transport_mode)} - ${esc(filled.port_loading)})</div>
        </div>
        <div style="margin-top:12px;text-align:right">
          <div>For ${esc(company.company_name || "")}</div>
          <div style="margin-top:36px;border-top:1px solid ${colors.border};width:220px;margin-left:auto"></div>
          <div style="font-size:11px;color:${colors.textSecondary}">Authorized Signatory</div>
        </div>
      </div>
    </div>

    <div style="border-top:1px solid ${colors.border};padding-top:10px;font-size:11px;color:${colors.textSecondary}">
      <div style="display:flex;justify-content:space-between">
        <div>${esc(company.company_name || "")} ${esc(company.comp_reg_city || "")}</div>
        <div>Document generated on ${esc(currentDate)}</div>
      </div>
    </div>
  </div>
  `;
};

/* generateDocuments wrapper - returns HTML strings for selected templates */
export const generateDocuments = (selectedTemplates = [], companyData = {}, userInputs = {}) => {
  const docIds = buildDocIds();
  const currentDate = new Date().toLocaleDateString("en-GB");

  return selectedTemplates.map((template) => {
    let html = "";
    switch (template.id) {
      case "commercial_invoice":
        html = generateCommercialInvoiceHTML(companyData, userInputs, docIds, currentDate);
        break;
      case "proforma_invoice":
        html = generateCommercialInvoiceHTML(companyData, userInputs, { ...docIds, invoiceNumber: `PI${docIds.Number1}` }, currentDate).replace("COMMERCIAL INVOICE", "PROFORMA INVOICE");
        break;
      case "packing_list":
        // use PackingList React rendering server-side not implemented; fallback simple
        html = generateCommercialInvoiceHTML(companyData, userInputs, docIds, currentDate).replace("COMMERCIAL INVOICE", "PACKING LIST");
        break;
      case "delivery_challan":
        html = generateCommercialInvoiceHTML(companyData, userInputs, docIds, currentDate).replace("COMMERCIAL INVOICE", "DELIVERY CHALLAN");
        break;
      case "credit_note":
        html = generateCommercialInvoiceHTML(companyData, userInputs, docIds, currentDate).replace("COMMERCIAL INVOICE", "CREDIT NOTE");
        break;
      case "debit_note":
        html = generateCommercialInvoiceHTML(companyData, userInputs, docIds, currentDate).replace("COMMERCIAL INVOICE", "DEBIT NOTE");
        break;
      default:
        html = `<div style="padding:20px;font-family:Arial;color:${colors.textPrimary}">Template ${esc(template.id)} not found</div>`;
    }
    return {
      id: template.id,
      name: template.name || template.id,
      html,
    };
  });
};

export default {
  buildDocIds,
  parseProducts,
  calculateTotals,
  autofillInputs,
  CommercialInvoice,
  ProformaInvoice,
  PackingList,
  DeliveryChallan,
  CreditNote,
  DebitNote,
  generateDocuments,
};
