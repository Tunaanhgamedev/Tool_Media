import React from "react";
import { Range, getTrackBackground } from "react-range";

const STEP = 1;

function fmt(sec) {
  sec = Math.max(0, Math.floor(sec));
  const hh = String(Math.floor(sec / 3600)).padStart(2, "0");
  const mm = String(Math.floor((sec % 3600) / 60)).padStart(2, "0");
  const ss = String(sec % 60).padStart(2, "0");
  return `${hh}:${mm}:${ss}`;
}

export default function TimelineRange({ durationSec = 60, values, setValues }) {
  const [start, end] = values;

  return (
    <div>
      <div className="row" style={{ justifyContent: "space-between" }}>
        <span className="pill">Start: {fmt(start)}</span>
        <span className="pill">End: {fmt(end)}</span>
        <span className="pill">Len: {fmt(end - start)}</span>
      </div>

      <div style={{ padding: "16px 8px" }}>
        <Range
          values={values}
          step={STEP}
          min={0}
          max={Math.max(1, durationSec)}
          onChange={(v) => setValues(v)}
          renderTrack={({ props, children }) => (
            <div
              onMouseDown={props.onMouseDown}
              onTouchStart={props.onTouchStart}
              style={{
                ...props.style,
                height: "36px",
                display: "flex",
                width: "100%",
              }}
            >
              <div
                ref={props.ref}
                style={{
                  height: "10px",
                  width: "100%",
                  borderRadius: "999px",
                  background: getTrackBackground({
                    values,
                    colors: [
                      "rgba(255,255,255,.15)",
                      "rgba(109,123,255,1)",
                      "rgba(255,255,255,.15)",
                    ],
                    min: 0,
                    max: Math.max(1, durationSec),
                  }),
                  alignSelf: "center",
                }}
              >
                {children}
              </div>
            </div>
          )}
          renderThumb={({ props, index }) => (
            <div
              {...props}
              style={{
                ...props.style,
                height: "22px",
                width: "22px",
                borderRadius: "50%",
                background: "#e9ecff",
                boxShadow: "0 2px 12px rgba(0,0,0,.35)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div style={{ fontSize: 10, fontWeight: 900, color: "#0b1020" }}>
                {index === 0 ? "S" : "E"}
              </div>
            </div>
          )}
        />
      </div>
    </div>
  );
}
