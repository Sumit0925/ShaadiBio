import React from "react";
import { formatDate } from "../utils/helpers";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function getPhotoUrl(photo) {
  if (!photo) return null;
  if (photo.startsWith("data:") || photo.startsWith("http")) return photo;
  return `${API_URL}/${photo.replace(/^\//, "")}`;
}

function Row({ label, value }) {
  if (!value) return null;
  return (
    <div
      style={{
        display: "flex",
        padding: "3px 0",
        borderBottom: "1px dotted #e8c090",
      }}
    >
      <span
        style={{
          fontWeight: "bold",
          color: "#8b1a1a",
          minWidth: 120,
          fontSize: 12,
          flexShrink: 0,
        }}
      >
        {label}:
      </span>
      <span style={{ color: "#2d1a00", fontSize: 12, flex: 1 }}>{value}</span>
    </div>
  );
}

function Section({ title, children }) {
  const hasContent = React.Children.toArray(children).some(
    (c) => c !== null && c !== false && c !== undefined,
  );
  if (!hasContent) return null;
  return (
    <div style={{ marginBottom: 14 }}>
      <div
        style={{
          background: "linear-gradient(135deg, #8b1a1a, #c0392b)",
          color: "white",
          fontWeight: "bold",
          fontSize: 11,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          padding: "4px 10px",
          borderRadius: 4,
          marginBottom: 8,
        }}
      >
        {title}
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "0 16px",
          paddingLeft: 4,
        }}
      >
        {children}
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
        overflow: "hidden",
        maxWidth: 680,
        margin: "0 auto",
        boxShadow: "0 4px 20px rgba(200,135,58,0.15)",
        position: "relative",
      }}
    >
      {/* Header */}
      <div
        style={{
          background:
            "linear-gradient(135deg, #7b241c 0%, #c0392b 60%, #e67e22 100%)",
          padding: "20px 16px",
          textAlign: "center",
          position: "relative",
        }}
      >
        <div
          style={{
            fontFamily: '"Noto Serif Devanagari", serif',
            color: "#ffd700",
            fontSize: 14,
            marginBottom: 8,
            letterSpacing: "0.05em",
          }}
        >
          ॥ श्री गणेशाय नमः ॥
        </div>

        {/* Photo */}
        {photoUrl && (
          <div style={{ marginBottom: 10 }}>
            <img
              src={photoUrl}
              alt="Profile"
              style={{
                width: 90,
                height: 90,
                borderRadius: "50%",
                objectFit: "cover",
                border: "3px solid #ffd700",
                display: "inline-block",
              }}
              crossOrigin="anonymous"
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
          }}
        >
          {data.name || "Your Name"}
        </div>
        {data.profession && (
          <div style={{ color: "#ffe0a0", fontSize: 13 }}>
            {data.profession}
          </div>
        )}
        {data.religion && data.caste && (
          <div style={{ color: "#ffc080", fontSize: 12, marginTop: 3 }}>
            {data.religion} · {data.caste}
          </div>
        )}

        {/* Quick stats bar */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 16,
            marginTop: 12,
            flexWrap: "wrap",
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
                  background: "rgba(255,255,255,0.15)",
                  color: "white",
                  fontSize: 11,
                  padding: "2px 10px",
                  borderRadius: 20,
                  border: "1px solid rgba(255,215,0,0.4)",
                }}
              >
                {s}
              </span>
            ))}
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: "14px 16px" }}>
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
          <Row label="College/University" value={data.college} />
          <Row label="Profession" value={data.profession} />
          <Row label="Company/Org" value={data.company} />
          {!data.hideIncome && (
            <Row label="Annual Income" value={data.income} />
          )}
        </Section>

        <Section title="Family Details">
          <Row label="Father's Name" value={data.fatherName} />
          <Row label="Father's Occupation" value={data.fatherOccupation} />
          <Row label="Mother's Name" value={data.motherName} />
          <Row label="Mother's Occupation" value={data.motherOccupation} />
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
          <div style={{ marginBottom: 14 }}>
            <div
              style={{
                background: "linear-gradient(135deg, #8b1a1a, #c0392b)",
                color: "white",
                fontWeight: "bold",
                fontSize: 11,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                padding: "4px 10px",
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
        }}
      >
        Generated with ShaadiBio · Marriage BioData Generator
      </div>

      {/* Watermark — shown for guests only */}
      {showWatermark && (
        <>
          {[20, 50, 80].map((top) => (
            <div
              key={top}
              style={{
                position: "absolute",
                top: `${top}%`,
                left: "50%",
                transform: "translate(-50%, -50%) rotate(-35deg)",
                fontSize: "42px",
                fontWeight: "900",
                color: "rgba(139, 26, 26, 0.09)",
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
        </>
      )}
    </div>
  );
}
