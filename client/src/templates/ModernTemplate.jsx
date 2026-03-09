import React from 'react';
import { formatDate } from '../utils/helpers';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function getPhotoUrl(photo) {
  if (!photo) return null;
  if (photo.startsWith('data:') || photo.startsWith('http')) return photo;
  return `${API_URL}/${photo.replace(/^\//, '')}`;
}

function Item({ icon, label, value }) {
  if (!value) return null;
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: 8,
      padding: '6px 0', borderBottom: '1px solid #f0f4f8',
    }}>
      <span style={{ fontSize: 14, minWidth: 20 }}>{icon}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 9, fontWeight: 700, color: '#1a6080', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</div>
        <div style={{ fontSize: 12, color: '#1a2a3a', marginTop: 1 }}>{value}</div>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  const hasContent = React.Children.toArray(children).some(c => c !== null && c !== false && c !== undefined);
  if (!hasContent) return null;
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{
        fontSize: 10, fontWeight: 700, color: '#1a6080',
        textTransform: 'uppercase', letterSpacing: '0.12em',
        borderBottom: '2px solid #7cc8e0',
        paddingBottom: 4, marginBottom: 8,
      }}>
        {title}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 12px' }}>
        {children}
      </div>
    </div>
  );
}

export default function ModernTemplate({ data = {}, showWatermark = false }) {
  const photoUrl = getPhotoUrl(data.photo);
  const showHoroscope = data.rashi || data.nakshatra || data.gothra || data.manglik || data.birthTime || data.birthPlace;
  const showContact = !data.hideContact && (data.contactEmail || data.phone || data.address || data.city);
  const showAbout = data.about?.trim();

  return (
    <div id="biodata-modern" style={{
      fontFamily: '"Segoe UI", "Helvetica Neue", Arial, sans-serif',
      background: 'white',
      borderRadius: 8,
      overflow: 'hidden',
      maxWidth: 680,
      margin: '0 auto',
      display: 'flex',
      boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
      position: 'relative',
    }}>
      {/* Sidebar */}
      <div style={{
        width: 180,
        flexShrink: 0,
        background: 'linear-gradient(180deg, #041f2e 0%, #0d4d6a 100%)',
        padding: '20px 14px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 0,
      }}>
        {/* Photo */}
        <div style={{ marginBottom: 12 }}>
          {photoUrl ? (
            <img
              src={photoUrl}
              alt="Profile"
              style={{
                width: 80, height: 80, borderRadius: '50%',
                objectFit: 'cover', border: '2px solid #7cc8e0',
              }}
              crossOrigin="anonymous"
            />
          ) : (
            <div style={{
              width: 80, height: 80, borderRadius: '50%',
              background: 'rgba(124,200,224,0.2)',
              border: '2px solid #7cc8e0',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 28, color: '#7cc8e0',
            }}>
              {data.name?.[0] || '?'}
            </div>
          )}
        </div>

        <div style={{ textAlign: 'center', color: 'white', marginBottom: 16 }}>
          <div style={{ fontWeight: 700, fontSize: 14, lineHeight: 1.3, marginBottom: 4 }}>
            {data.name || 'Your Name'}
          </div>
          {data.profession && (
            <div style={{ color: '#7cc8e0', fontSize: 11 }}>{data.profession}</div>
          )}
          {data.company && (
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 10, marginTop: 2 }}>{data.company}</div>
          )}
        </div>

        {/* Quick stats */}
        <div style={{ width: '100%' }}>
          {[
            data.age && { label: 'Age', value: `${data.age} yrs` },
            data.height && { label: 'Height', value: data.height },
            data.religion && { label: 'Religion', value: data.religion },
            data.caste && { label: 'Caste', value: data.caste },
            data.city && { label: 'City', value: data.city },
          ].filter(Boolean).map((stat, i) => (
            <div key={i} style={{
              display: 'flex', justifyContent: 'space-between',
              padding: '4px 0', borderBottom: '1px solid rgba(124,200,224,0.15)',
            }}>
              <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 10 }}>{stat.label}</span>
              <span style={{ color: 'white', fontSize: 10, fontWeight: 600, textAlign: 'right', maxWidth: 80, wordBreak: 'break-word' }}>
                {stat.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, padding: '16px 16px 12px', overflowY: 'auto' }}>
        <Section title="Personal Details">
          <Item icon="👤" label="Full Name" value={data.name} />
          <Item icon="⚥" label="Gender" value={data.gender} />
          <Item icon="🎂" label="Date of Birth" value={formatDate(data.dob)} />
          <Item icon="🩸" label="Blood Group" value={data.bloodGroup} />
          <Item icon="🎨" label="Complexion" value={data.complexion} />
          <Item icon="💒" label="Marital Status" value={data.maritalStatus} />
          <Item icon="🗣️" label="Mother Tongue" value={data.motherTongue} />
          <Item icon="🏳️" label="Nationality" value={data.nationality} />
        </Section>

        <Section title="Education & Career">
          <Item icon="🎓" label="Education" value={data.education} />
          <Item icon="🏫" label="College" value={data.college} />
          <Item icon="💼" label="Profession" value={data.profession} />
          <Item icon="🏢" label="Company" value={data.company} />
          {!data.hideIncome && <Item icon="💰" label="Income" value={data.income} />}
        </Section>

        <Section title="Family">
          <Item icon="👨" label="Father" value={data.fatherName} />
          <Item icon="💼" label="Father's Occ." value={data.fatherOccupation} />
          <Item icon="👩" label="Mother" value={data.motherName} />
          <Item icon="💼" label="Mother's Occ." value={data.motherOccupation} />
          <Item icon="👫" label="Siblings" value={data.siblings} />
          <Item icon="🏠" label="Family Type" value={data.familyType} />
          <Item icon="💎" label="Family Status" value={data.familyStatus} />
          <Item icon="📍" label="Native Place" value={data.nativePlace} />
        </Section>

        {showHoroscope && (
          <Section title="Horoscope">
            <Item icon="♈" label="Rashi" value={data.rashi} />
            <Item icon="⭐" label="Nakshatra" value={data.nakshatra} />
            <Item icon="🌙" label="Gothra" value={data.gothra} />
            <Item icon="🔴" label="Manglik" value={data.manglik} />
            <Item icon="⏰" label="Birth Time" value={data.birthTime} />
            <Item icon="📍" label="Birth Place" value={data.birthPlace} />
          </Section>
        )}

        {showContact && (
          <Section title="Contact">
            <Item icon="📧" label="Email" value={data.contactEmail} />
            <Item icon="📱" label="Phone" value={data.phone} />
            <Item icon="🏙️" label="City" value={data.city} />
            <Item icon="🗺️" label="State" value={data.state} />
            <Item icon="📮" label="Address" value={data.address} />
          </Section>
        )}

        {showAbout && (
          <div style={{ marginBottom: 12 }}>
            <div style={{
              fontSize: 10, fontWeight: 700, color: '#1a6080',
              textTransform: 'uppercase', letterSpacing: '0.12em',
              borderBottom: '2px solid #7cc8e0',
              paddingBottom: 4, marginBottom: 8,
            }}>
              About Me
            </div>
            <p style={{ color: '#2a3a4a', fontSize: 12, lineHeight: 1.7 }}>{data.about}</p>
          </div>
        )}

        {/* Footer */}
        <div style={{
          background: '#041f2e', color: '#7cc8e0',
          fontSize: 10, textAlign: 'center', padding: '6px 12px',
          borderRadius: 4, marginTop: 8,
        }}>
          Generated with ShaadiBio
        </div>
      </div>

      {/* Watermark — shown for guests only */}
      {showWatermark && (
        <>
          {[20, 50, 80].map((top) => (
            <div key={top} style={{
              position: 'absolute',
              top: `${top}%`,
              left: '50%',
              transform: 'translate(-50%, -50%) rotate(-35deg)',
              fontSize: '38px',
              fontWeight: '900',
              color: 'rgba(4, 31, 46, 0.09)',
              whiteSpace: 'nowrap',
              pointerEvents: 'none',
              zIndex: 50,
              fontFamily: '"Segoe UI", Arial, sans-serif',
              letterSpacing: '0.06em',
              userSelect: 'none',
              lineHeight: 1,
            }}>
              ShaadiBio — SAMPLE
            </div>
          ))}
        </>
      )}
    </div>
  );
}
