import React from "react";
import { formatDate } from "../utils/helpers";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function getPhotoUrl(photo) {
  if (!photo) return null;
  if (photo.startsWith("data:") || photo.startsWith("http")) return photo;
  return `${API_URL}/${photo.replace(/^\//, "")}`;
}

/*
 * Row — label + value in a flex row.
 * Uses ONLY flexbox — no CSS grid — so html2canvas captures it correctly.
 * Explicit px widths prevent any layout collapse during capture.
 */
function Row({ label, value }) {
  if (!value) return null;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-start",
        padding: "4px 0",
        borderBottom: "1px dotted #e8c090",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      <span
        style={{
          fontWeight: "bold",
          color: "#8b1a1a",
          width: "120px",
          minWidth: "120px",
          maxWidth: "120px",
          fontSize: 12,
          flexShrink: 0,
          lineHeight: 1.5,
        }}
      >
        {label}:
      </span>
      <span
        style={{
          color: "#2d1a00",
          fontSize: 12,
          flex: 1,
          lineHeight: 1.5,
          wordBreak: "break-word",
        }}
      >
        {value}
      </span>
    </div>
  );
}

/*
 * Section — heading + two-column layout.
 * Two columns = two side-by-side flex divs at 50% each.
 * NO CSS grid — grid with 1fr collapses in html2canvas without a known parent width.
 */
function Section({ title, children }) {
  const rows = React.Children.toArray(children).filter(
    (c) => c !== null && c !== false && c !== undefined,
  );
  if (rows.length === 0) return null;

  const left = rows.filter((_, i) => i % 2 === 0);
  const right = rows.filter((_, i) => i % 2 === 1);

  return (
    <div style={{ marginBottom: 14, width: "100%" }}>
      <div
        style={{
          background: "linear-gradient(135deg, #8b1a1a, #c0392b)",
          color: "white",
          fontWeight: "bold",
          fontSize: 11,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          padding: "5px 12px",
          borderRadius: 4,
          marginBottom: 8,
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        {title}
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "0 10px",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>{left}</div>
        <div style={{ flex: 1, minWidth: 0 }}>{right}</div>
      </div>
    </div>
  );
}

export default function TraditionalTemplate({
  data = {},
  showWatermark = false,
}) {
  const photoUrl = getPhotoUrl(data.photo);
  const showHoroscope =
    data.rashi ||
    data.nakshatra ||
    data.gothra ||
    data.manglik ||
    data.birthTime ||
    data.birthPlace;
  const showContact =
    !data.hideContact &&
    (data.contactEmail || data.phone || data.address || data.city);
  const showAbout = data.about?.trim();

  return (
    <div
      id="biodata-traditional"
      style={{
        fontFamily: 'Georgia, "Times New Roman", serif',
        background: "#fffdf9",
        border: "3px solid #c8873a",
        borderRadius: 8,
        overflow: "visible",
        width: "100%",
        maxWidth: 680,
        margin: "0 auto",
        position: "relative",
        boxSizing: "border-box",
      }}
    >
      {/* Header */}
      <div
        style={{
          background:
            "linear-gradient(135deg, #7b241c 0%, #c0392b 60%, #e67e22 100%)",
          padding: "20px 16px 16px",
          textAlign: "center",
          borderRadius: "5px 5px 0 0",
        }}
      >
        <div
          style={{
            fontFamily: '"Noto Serif Devanagari", serif',
            color: "#ffd700",
            fontSize: 14,
            marginBottom: 10,
            letterSpacing: "0.05em",
          }}
        >
          ॥ श्री गणेशाय नमः ॥
        </div>

        {photoUrl && (
          <div style={{ marginBottom: 12 }}>
            <img
              src={photoUrl}
              alt="Profile"
              crossOrigin="anonymous"
              style={{
                width: 90,
                height: 90,
                borderRadius: "50%",
                objectFit: "cover",
                border: "3px solid #ffd700",
                display: "inline-block",
              }}
            />
          </div>
        )}

        <div
          style={{
            fontFamily: '"Playfair Display", Georgia, serif',
            color: "white",
            fontSize: 22,
            fontWeight: 700,
            marginBottom: 4,
            lineHeight: 1.3,
          }}
        >
          {data.name || "Your Name"}
        </div>
        {data.profession && (
          <div style={{ color: "#ffe0a0", fontSize: 13, marginBottom: 2 }}>
            {data.profession}
          </div>
        )}
        {data.religion && data.caste && (
          <div style={{ color: "#ffc080", fontSize: 12, marginBottom: 8 }}>
            {data.religion} · {data.caste}
          </div>
        )}

<div
  style={{
    textAlign: "center",
    marginTop: "8px",
  }}
>
  {[
    data.age && `Age: ${data.age} yrs`,
    data.height && `Height: ${data.height}`,
    data.maritalStatus && data.maritalStatus,
  ]
    .filter(Boolean)
    .map((s, i) => (
      <span
        key={i}
        style={{
          display: "inline-block",
          background: "rgba(255,255,255,0.15)",
          color: "white",
          fontSize: "11px",
          lineHeight: "14px",
          padding: "2px 10px",
          borderRadius: "20px",
          border: "1px solid rgba(255,215,0,0.4)",
          margin: "4px",
          whiteSpace: "nowrap",
          verticalAlign: "middle",
        }}
      >
        {s}
      </span>
    ))}
</div>
      </div>

      {/* Body */}
      <div
        style={{
          padding: "14px 14px 8px",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        <Section title="Personal Information">
          <Row label="Full Name" value={data.name} />
          <Row label="Gender" value={data.gender} />
          <Row label="Date of Birth" value={formatDate(data.dob)} />
          <Row label="Age" value={data.age ? `${data.age} Years` : ""} />
          <Row label="Height" value={data.height} />
          <Row label="Complexion" value={data.complexion} />
          <Row label="Blood Group" value={data.bloodGroup} />
          <Row label="Religion" value={data.religion} />
          <Row label="Caste" value={data.caste} />
          <Row label="Mother Tongue" value={data.motherTongue} />
          <Row label="Marital Status" value={data.maritalStatus} />
          <Row label="Nationality" value={data.nationality} />
        </Section>

        <Section title="Education & Profession">
          <Row label="Education" value={data.education} />
          <Row label="College/Univ" value={data.college} />
          <Row label="Profession" value={data.profession} />
          <Row label="Company/Org" value={data.company} />
          {!data.hideIncome && (
            <Row label="Annual Income" value={data.income} />
          )}
        </Section>

        <Section title="Family Details">
          <Row label="Father's Name" value={data.fatherName} />
          <Row label="Father's Occ." value={data.fatherOccupation} />
          <Row label="Mother's Name" value={data.motherName} />
          <Row label="Mother's Occ." value={data.motherOccupation} />
          <Row label="Siblings" value={data.siblings} />
          <Row label="Family Type" value={data.familyType} />
          <Row label="Family Status" value={data.familyStatus} />
          <Row label="Native Place" value={data.nativePlace} />
        </Section>

        {showHoroscope && (
          <Section title="Horoscope Details">
            <Row label="Rashi" value={data.rashi} />
            <Row label="Nakshatra" value={data.nakshatra} />
            <Row label="Gothra" value={data.gothra} />
            <Row label="Manglik" value={data.manglik} />
            <Row label="Birth Time" value={data.birthTime} />
            <Row label="Birth Place" value={data.birthPlace} />
          </Section>
        )}

        {showContact && (
          <Section title="Contact Information">
            <Row label="Email" value={data.contactEmail} />
            <Row label="Phone" value={data.phone} />
            <Row label="City" value={data.city} />
            <Row label="State" value={data.state} />
            <Row label="Address" value={data.address} />
          </Section>
        )}

        {showAbout && (
          <div style={{ marginBottom: 14, width: "100%" }}>
            <div
              style={{
                background: "linear-gradient(135deg, #8b1a1a, #c0392b)",
                color: "white",
                fontWeight: "bold",
                fontSize: 11,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                padding: "5px 12px",
                borderRadius: 4,
                marginBottom: 8,
              }}
            >
              About Me
            </div>
            <p
              style={{
                color: "#2d1a00",
                fontSize: 12,
                lineHeight: 1.6,
                paddingLeft: 4,
              }}
            >
              {data.about}
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div
        style={{
          background: "linear-gradient(135deg, #7b241c, #c0392b)",
          color: "rgba(255,255,255,0.8)",
          textAlign: "center",
          fontSize: 11,
          padding: "8px 16px",
          borderRadius: "0 0 5px 5px",
        }}
      >
        Generated with ShaadiBio · Marriage BioData Generator
      </div>

      {/* Watermarks */}
      {showWatermark &&
        [20, 50, 80].map((top) => (
          <div
            key={top}
            style={{
              position: "absolute",
              top: `${top}%`,
              left: "50%",
              transform: "translate(-50%, -50%) rotate(-35deg)",
              fontSize: 42,
              fontWeight: 900,
              color: "rgba(139,26,26,0.09)",
              whiteSpace: "nowrap",
              pointerEvents: "none",
              zIndex: 50,
              fontFamily: "Georgia, serif",
              letterSpacing: "0.06em",
              userSelect: "none",
              lineHeight: 1,
            }}
          >
            ShaadiBio — SAMPLE
          </div>
        ))}
    </div>
  );
}
