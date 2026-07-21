import logoCuadrado from './assets/logo_corto.png';
import logoHorizontal from './assets/logo_largo.png';



import { useState } from "react";

const ROOMS = [
  { id: 1, name: "Room 1", color: "#2563EB", light: "#DBEAFE", text: "#1E3A8A" },
  { id: 2, name: "Room 2", color: "#16A34A", light: "#DCFCE7", text: "#14532D" },
  { id: 3, name: "Goldfish", color: "#EA580C", light: "#FFEDD5", text: "#7C2D12" },
  { id: 4, name: "Desk", color: "#6B7280", light: "#F3F4F6", text: "#1F2937" },
];

const DAYS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
const HOURS_WEEKDAY = Array.from({ length: 9 }, (_, i) => `${14 + i}:00`);

const SCHEDULE_DATA = [
  { room: 1, day: 0, hour: 14, duration: 2, teacher: "Ana García", students: 8, subject: "Inglés B1" },
  { room: 1, day: 1, hour: 16, duration: 2, teacher: "Ana García", students: 6, subject: "Inglés B2" },
  { room: 2, day: 0, hour: 15, duration: 1, teacher: "Carlos López", students: 10, subject: "Francés A2" },
  { room: 2, day: 2, hour: 17, duration: 2, teacher: "Carlos López", students: 7, subject: "Francés B1" },
  { room: 3, day: 1, hour: 14, duration: 2, teacher: "María Ruiz", students: 5, subject: "Alemán A1" },
  { room: 3, day: 3, hour: 18, duration: 2, teacher: "María Ruiz", students: 9, subject: "Alemán A2" },
  { room: 4, day: 5, hour: 9, duration: 2, teacher: "Pedro Sanz", students: 12, subject: "Inglés Conversación" },
  { room: 1, day: 5, hour: 10, duration: 2, teacher: "Ana García", students: 8, subject: "Inglés B1 (Sabatino)" },
];

const STUDENTS = [
  { id: 1, name: "Laura Martínez", dni: "12345678A", email: "laura@email.com", age: 17, tutor: "Rosa Martínez", bank: "ES12 3456 7890 1234 5678 90", course: "Inglés B1", days: 3, price: 120 },
  { id: 2, name: "Pablo Fernández", dni: "87654321B", email: "pablo@email.com", age: 25, tutor: null, bank: "ES98 7654 3210 9876 5432 10", course: "Francés A2", days: 2, price: 90 },
  { id: 3, name: "Sofía Hernández", dni: "11223344C", email: "sofia@email.com", age: 14, tutor: "Juan Hernández", bank: "ES11 2233 4455 6677 8899 00", course: "Alemán A1", days: 2, price: 90 },
];

const TEACHERS = [
  { id: 1, name: "Ana García", checkins: [{ date: "21/07/2025", in: "13:55", out: "21:05" }] },
  { id: 2, name: "Carlos López", checkins: [{ date: "21/07/2025", in: "14:02", out: "18:00" }] },
  { id: 3, name: "María Ruiz", checkins: [] },
  { id: 4, name: "Pedro Sanz", checkins: [{ date: "19/07/2025", in: "08:58", out: "14:10" }] },
];

function generatePDF(student) {
  const content = `
FACTURA - FEELING PALENCIA
==============================

Alumno: ${student.name}
DNI: ${student.dni}
Email: ${student.email}
${student.tutor ? `Tutor/a: ${student.tutor}` : ""}
Cuenta bancaria: ${student.bank}

Curso: ${student.course}
Días por semana: ${student.days}
Precio mensual: ${student.price}€

Fecha de emisión: ${new Date().toLocaleDateString("es-ES")}
  `;
  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `Factura_${student.name.replace(" ", "_")}.txt`;
  a.click();
}

export default function AcademyApp() {
  const [view, setView] = useState("schedule");
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", minHeight: "100vh", background: "#F8FAFC" }}>
      {/* Header */}
      <div style={{ background: "#1E293B", color: "white", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 56 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <img src={logoCuadrado} alt="Feeling Palencia" style={{ width: 32, height: 32, borderRadius: 8, objectFit: "contain" }} />
          <span style={{ fontWeight: 600, fontSize: 16 }}>Feeling Palencia</span>
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          {["schedule", "students", "teachers", "rooms"].map(v => (
            <button key={v} onClick={() => setView(v)} style={{
              padding: "6px 14px", borderRadius: 6, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 500,
              background: view === v ? "#3B82F6" : "transparent", color: view === v ? "white" : "#94A3B8",
              transition: "all 0.15s"
            }}>
              {{ schedule: "Horarios", students: "Alumnos", teachers: "Profesores", rooms: "Salas" }[v]}
            </button>
          ))}
        </div>
        <div style={{ fontSize: 13, color: "#94A3B8" }}>Admin</div>
      </div>

      <div style={{ padding: 24, maxWidth: 1200, margin: "0 auto" }}>

        {/* SCHEDULE VIEW */}
        {view === "schedule" && (
          <div>
            <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
              {ROOMS.map(r => (
                <button key={r.id} onClick={() => setSelectedRoom(selectedRoom === r.id ? null : r.id)} style={{
                  padding: "6px 16px", borderRadius: 20, border: `2px solid ${r.color}`,
                  background: selectedRoom === r.id ? r.color : "white",
                  color: selectedRoom === r.id ? "white" : r.color,
                  cursor: "pointer", fontWeight: 600, fontSize: 13, transition: "all 0.15s"
                }}>{r.name}</button>
              ))}
              {selectedRoom && <button onClick={() => setSelectedRoom(null)} style={{ padding: "6px 16px", borderRadius: 20, border: "2px solid #E2E8F0", background: "white", color: "#64748B", cursor: "pointer", fontSize: 13 }}>Ver todas</button>}
            </div>

            <div style={{ background: "white", borderRadius: 12, border: "1px solid #E2E8F0", overflow: "hidden" }}>
              <div style={{ display: "grid", gridTemplateColumns: "80px repeat(6, 1fr)", borderBottom: "1px solid #E2E8F0" }}>
                <div style={{ padding: "12px 8px", background: "#F8FAFC" }} />
                {DAYS.map(d => (
                  <div key={d} style={{ padding: "12px 8px", textAlign: "center", fontWeight: 600, fontSize: 13, color: "#374151", background: "#F8FAFC", borderLeft: "1px solid #E2E8F0" }}>{d}</div>
                ))}
              </div>

              {HOURS_WEEKDAY.map((hour, hi) => (
                <div key={hour} style={{ display: "grid", gridTemplateColumns: "80px repeat(6, 1fr)", borderBottom: "1px solid #F1F5F9" }}>
                  <div style={{ padding: "10px 8px", fontSize: 12, color: "#94A3B8", fontWeight: 500, display: "flex", alignItems: "center" }}>{hour}</div>
                  {DAYS.map((_, di) => {
                    const hourNum = 14 + hi;
                    const isSat = di === 5;
                    const satHour = 9 + hi;
                    const actualHour = isSat ? satHour : hourNum;
                    const isOutOfHours = isSat && (satHour < 9 || satHour >= 14);

                    const classes = SCHEDULE_DATA.filter(c => {
                      const dayMatch = c.day === di;
                      const hourMatch = c.hour === actualHour;
                      const roomMatch = !selectedRoom || c.room === selectedRoom;
                      return dayMatch && hourMatch && roomMatch && !isOutOfHours;
                    });

                    return (
                      <div key={di} style={{ borderLeft: "1px solid #E2E8F0", padding: 4, minHeight: 52, background: isOutOfHours ? "#F8FAFC" : "white" }}>
                        {classes.map((c, ci) => {
                          const room = ROOMS.find(r => r.id === c.room);
                          return (
                            <div key={ci} style={{
                              background: room.light, borderLeft: `3px solid ${room.color}`,
                              borderRadius: 4, padding: "4px 6px", marginBottom: 2
                            }}>
                              <div style={{ fontSize: 11, fontWeight: 600, color: room.text }}>{c.subject}</div>
                              <div style={{ fontSize: 10, color: room.text, opacity: 0.8 }}>{room.name} · {c.teacher}</div>
                              <div style={{ fontSize: 10, color: room.text, opacity: 0.7 }}>{c.students} alumnos</div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STUDENTS VIEW */}
        {view === "students" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#1E293B" }}>Alumnos <span style={{ color: "#64748B", fontWeight: 400, fontSize: 15 }}>({STUDENTS.length})</span></h2>
              <button style={{ padding: "8px 16px", background: "#3B82F6", color: "white", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600, fontSize: 13 }}>+ Nuevo alumno</button>
            </div>

            <div style={{ display: "grid", gap: 12 }}>
              {STUDENTS.map(s => (
                <div key={s.id} style={{ background: "white", borderRadius: 12, border: "1px solid #E2E8F0", padding: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <div style={{ width: 44, height: 44, borderRadius: "50%", background: "#EFF6FF", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "#3B82F6", fontSize: 16 }}>
                      {s.name.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, color: "#1E293B", fontSize: 15, display: "flex", alignItems: "center", gap: 8 }}>
                        {s.name}
                        {s.age < 18 && <span style={{ fontSize: 11, background: "#FEF3C7", color: "#92400E", padding: "2px 8px", borderRadius: 10, fontWeight: 500 }}>Menor</span>}
                      </div>
                      <div style={{ fontSize: 13, color: "#64748B" }}>{s.course} · {s.days} días/semana · {s.price}€/mes</div>
                      {s.tutor && <div style={{ fontSize: 12, color: "#94A3B8" }}>Tutor: {s.tutor}</div>}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => setSelectedStudent(s)} style={{ padding: "7px 14px", background: "#F1F5F9", color: "#475569", border: "none", borderRadius: 7, cursor: "pointer", fontSize: 13, fontWeight: 500 }}>Ver ficha</button>
                    <button onClick={() => generatePDF(s)} style={{ padding: "7px 14px", background: "#3B82F6", color: "white", border: "none", borderRadius: 7, cursor: "pointer", fontSize: 13, fontWeight: 500 }}>Generar factura</button>
                  </div>
                </div>
              ))}
            </div>

            {selectedStudent && (
              <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50 }} onClick={() => setSelectedStudent(null)}>
                <div style={{ background: "white", borderRadius: 16, padding: 32, width: 480, maxWidth: "90vw" }} onClick={e => e.stopPropagation()}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24 }}>
                    <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Ficha del alumno</h3>
                    <button onClick={() => setSelectedStudent(null)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20, color: "#94A3B8" }}>×</button>
                  </div>
                  {[
                    ["Nombre", selectedStudent.name],
                    ["DNI", selectedStudent.dni],
                    ["Email", selectedStudent.email],
                    ["Edad", `${selectedStudent.age} años`],
                    selectedStudent.tutor ? ["Tutor/a", selectedStudent.tutor] : null,
                    ["Cuenta bancaria", selectedStudent.bank],
                    ["Curso", selectedStudent.course],
                    ["Días/semana", selectedStudent.days],
                    ["Precio mensual", `${selectedStudent.price}€`],
                  ].filter(Boolean).map(([label, value]) => (
                    <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #F1F5F9" }}>
                      <span style={{ fontSize: 13, color: "#64748B", fontWeight: 500 }}>{label}</span>
                      <span style={{ fontSize: 13, color: "#1E293B", fontWeight: 500 }}>{value}</span>
                    </div>
                  ))}
                  <button onClick={() => generatePDF(selectedStudent)} style={{ marginTop: 20, width: "100%", padding: "10px", background: "#3B82F6", color: "white", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600, fontSize: 14 }}>
                    Generar factura PDF
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TEACHERS VIEW */}
        {view === "teachers" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#1E293B" }}>Profesores</h2>
              <button style={{ padding: "8px 16px", background: "#3B82F6", color: "white", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600, fontSize: 13 }}>+ Nuevo profesor</button>
            </div>
            <div style={{ display: "grid", gap: 12 }}>
              {TEACHERS.map(t => (
                <div key={t.id} style={{ background: "white", borderRadius: 12, border: "1px solid #E2E8F0", padding: 20 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#F0FDF4", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "#16A34A" }}>
                        {t.name.charAt(0)}
                      </div>
                      <span style={{ fontWeight: 600, color: "#1E293B" }}>{t.name}</span>
                    </div>
                    <button style={{ padding: "7px 14px", background: "#16A34A", color: "white", border: "none", borderRadius: 7, cursor: "pointer", fontSize: 13, fontWeight: 500 }}>Fichar entrada</button>
                  </div>
                  {t.checkins.length > 0 ? (
                    <div>
                      <div style={{ fontSize: 12, color: "#94A3B8", marginBottom: 6, fontWeight: 500 }}>REGISTROS RECIENTES</div>
                      {t.checkins.map((c, i) => (
                        <div key={i} style={{ display: "flex", gap: 16, fontSize: 13, color: "#475569", padding: "6px 0", borderBottom: "1px solid #F1F5F9" }}>
                          <span>{c.date}</span>
                          <span>Entrada: <strong>{c.in}</strong></span>
                          <span>Salida: <strong>{c.out}</strong></span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ fontSize: 13, color: "#94A3B8" }}>Sin registros esta semana</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ROOMS VIEW */}
        {view === "rooms" && (
          <div>
            <h2 style={{ margin: "0 0 20px", fontSize: 20, fontWeight: 700, color: "#1E293B" }}>Salas</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
              {ROOMS.map(r => {
                const roomClasses = SCHEDULE_DATA.filter(c => c.room === r.id);
                const totalStudents = roomClasses.reduce((a, c) => a + c.students, 0);
                return (
                  <div key={r.id} style={{ background: "white", borderRadius: 12, border: `2px solid ${r.color}20`, overflow: "hidden" }}>
                    <div style={{ background: r.color, padding: "16px 20px" }}>
                      <div style={{ fontWeight: 700, fontSize: 18, color: "white" }}>{r.name}</div>
                    </div>
                    <div style={{ padding: 16 }}>
                      <div style={{ display: "flex", gap: 16, marginBottom: 12 }}>
                        <div style={{ textAlign: "center" }}>
                          <div style={{ fontSize: 22, fontWeight: 700, color: r.color }}>{roomClasses.length}</div>
                          <div style={{ fontSize: 11, color: "#94A3B8" }}>clases</div>
                        </div>
                        <div style={{ textAlign: "center" }}>
                          <div style={{ fontSize: 22, fontWeight: 700, color: r.color }}>{totalStudents}</div>
                          <div style={{ fontSize: 11, color: "#94A3B8" }}>alumnos</div>
                        </div>
                      </div>
                      {roomClasses.map((c, i) => (
                        <div key={i} style={{ fontSize: 12, color: "#475569", padding: "4px 0", borderBottom: "1px solid #F1F5F9" }}>
                          {DAYS[c.day]} {c.hour}:00 · {c.subject}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}