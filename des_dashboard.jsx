import { useState, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

const CATEGORIES = [
  "Director","Joint Director","Statistical Officer","Inspector of Statistics",
  "Sub-Inspector of Statistics","Primary Investigator","Registrar",
  "Superintendent Accountant","UDA","LDA","Typist","Peon","Other",
];
const DIVISIONS = ["Headquarters","East Khasi Hills","West Khasi Hills","South West Khasi Hills","Eastern West Khasi Hills","Ri Bhoi","West Jaintia Hills","East Jaintia Hills","North Garo Hills","East Garo Hills","West Garo Hills","South Garo Hills","South West Garo Hills","Field Unit"];
const GENDERS = ["Male","Female","Other"];
const STATUSES = ["Active","On Leave","Deputation","Retired"];
const PALETTE = ["#C9A84C","#4C7FC9","#4CC97F","#C94C4C","#9B4CC9","#4CC9C9","#C97F4C","#7FC94C","#C94C9B","#4C9BC9","#C9C94C","#4CC94C","#C96F4C"];
const SANCTIONED = {"Director":1,"Joint Director":3,"Statistical Officer":5,"Inspector of Statistics":6,"Sub-Inspector of Statistics":8,"Primary Investigator":10,"Registrar":2,"Superintendent Accountant":3,"UDA":6,"LDA":8,"Typist":4,"Peon":6,"Other":4};
const STATUS_COLOR = {Active:"#4CC97F","On Leave":"#C9A84C",Deputation:"#4C7FC9",Retired:"#888"};

const INIT_EMPS = [
  {id:1,name:"Dr. Ramesh Kumar",category:"Director",division:"Headquarters",gender:"Male",status:"Active",joinDate:"2010-03-15",empId:"DES-001"},
  {id:2,name:"Mrs. Sunita Sharma",category:"Joint Director",division:"Headquarters",gender:"Female",status:"Active",joinDate:"2012-07-22",empId:"DES-002"},
  {id:3,name:"Mr. Anil Verma",category:"Joint Director",division:"East Khasi Hills",gender:"Male",status:"Active",joinDate:"2013-01-10",empId:"DES-003"},
  {id:4,name:"Ms. Priya Singh",category:"Statistical Officer",division:"Headquarters",gender:"Female",status:"Active",joinDate:"2015-05-08",empId:"DES-004"},
  {id:5,name:"Mr. Mohan Das",category:"Statistical Officer",division:"West Jaintia Hills",gender:"Male",status:"On Leave",joinDate:"2016-09-14",empId:"DES-005"},
  {id:6,name:"Ms. Kavita Patel",category:"Statistical Officer",division:"East Garo Hills",gender:"Female",status:"Active",joinDate:"2017-03-20",empId:"DES-006"},
  {id:7,name:"Mr. Suresh Nair",category:"Inspector of Statistics",division:"Headquarters",gender:"Male",status:"Active",joinDate:"2014-11-05",empId:"DES-007"},
  {id:8,name:"Ms. Anita Roy",category:"Inspector of Statistics",division:"Ri Bhoi",gender:"Female",status:"Active",joinDate:"2015-06-18",empId:"DES-008"},
  {id:9,name:"Mr. Vijay Tiwari",category:"Inspector of Statistics",division:"West Garo Hills",gender:"Male",status:"Deputation",joinDate:"2016-02-28",empId:"DES-009"},
  {id:10,name:"Ms. Rekha Joshi",category:"Sub-Inspector of Statistics",division:"Headquarters",gender:"Female",status:"Active",joinDate:"2018-04-12",empId:"DES-010"},
  {id:11,name:"Mr. Deepak Mishra",category:"Sub-Inspector of Statistics",division:"North Garo Hills",gender:"Male",status:"Active",joinDate:"2019-08-30",empId:"DES-011"},
  {id:12,name:"Ms. Seema Gupta",category:"Sub-Inspector of Statistics",division:"South Garo Hills",gender:"Female",status:"Active",joinDate:"2020-01-15",empId:"DES-012"},
  {id:13,name:"Mr. Rahul Yadav",category:"Primary Investigator",division:"West Khasi Hills",gender:"Male",status:"Active",joinDate:"2019-06-10",empId:"DES-013"},
  {id:14,name:"Ms. Pooja Mehta",category:"Primary Investigator",division:"East Jaintia Hills",gender:"Female",status:"Active",joinDate:"2020-03-25",empId:"DES-014"},
  {id:15,name:"Mr. Amit Chauhan",category:"Primary Investigator",division:"South West Garo Hills",gender:"Male",status:"Active",joinDate:"2021-07-08",empId:"DES-015"},
  {id:16,name:"Mr. Ramakant Sinha",category:"Registrar",division:"Headquarters",gender:"Male",status:"Active",joinDate:"2011-09-01",empId:"DES-016"},
  {id:17,name:"Mr. Harish Pandey",category:"Superintendent Accountant",division:"Headquarters",gender:"Male",status:"Active",joinDate:"2013-04-15",empId:"DES-017"},
  {id:18,name:"Ms. Usha Devi",category:"UDA",division:"Headquarters",gender:"Female",status:"Active",joinDate:"2016-10-20",empId:"DES-018"},
  {id:19,name:"Mr. Santosh Kumar",category:"UDA",division:"East Khasi Hills",gender:"Male",status:"Active",joinDate:"2017-05-12",empId:"DES-019"},
  {id:20,name:"Ms. Lata Dubey",category:"LDA",division:"Headquarters",gender:"Female",status:"Active",joinDate:"2019-11-03",empId:"DES-020"},
  {id:21,name:"Mr. Dinesh Rawat",category:"LDA",division:"South West Khasi Hills",gender:"Male",status:"Active",joinDate:"2020-06-17",empId:"DES-021"},
  {id:22,name:"Ms. Nisha Tripathi",category:"Typist",division:"Headquarters",gender:"Female",status:"Active",joinDate:"2018-08-22",empId:"DES-022"},
  {id:23,name:"Mr. Gopal Sharma",category:"Peon",division:"Headquarters",gender:"Male",status:"Active",joinDate:"2015-03-30",empId:"DES-023"},
  {id:24,name:"Mr. Sanjay Bind",category:"Peon",division:"Eastern West Khasi Hills",gender:"Male",status:"Active",joinDate:"2016-07-14",empId:"DES-024"},
  {id:25,name:"Ms. Radha Kumari",category:"Other",division:"South West Garo Hills",gender:"Female",status:"Active",joinDate:"2021-02-09",empId:"DES-025"},
];

const EMPTY_FORM = {name:"",category:CATEGORIES[0],division:DIVISIONS[0],gender:GENDERS[0],status:STATUSES[0],joinDate:"",empId:""};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=DM+Serif+Display:ital@0;1&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  body{background:#0B1120;}
  ::-webkit-scrollbar{width:5px;height:5px;}
  ::-webkit-scrollbar-track{background:#0B1120;}
  ::-webkit-scrollbar-thumb{background:#232F48;border-radius:3px;}
  .des-wrap{min-height:100vh;background:#0B1120;font-family:'DM Sans',sans-serif;color:#E8EAF0;}
  .des-header{background:linear-gradient(180deg,#0F1B35 0%,#0B1120 100%);border-bottom:1px solid #1E2B45;padding:16px 28px;}
  .des-header-inner{max-width:1360px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;gap:16px;}
  .des-logo{width:50px;height:50px;border-radius:50%;background:linear-gradient(135deg,#C9A84C,#7A5A18);display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:800;color:#0B1120;box-shadow:0 0 24px rgba(201,168,76,.35);flex-shrink:0;}
  .des-title{font-family:'DM Serif Display',serif;font-size:17px;color:#C9A84C;line-height:1.25;}
  .des-subtitle{font-size:11px;color:#445068;margin-top:2px;}
  .des-strength-badge{text-align:right;}
  .des-strength-num{font-size:26px;font-weight:700;color:#C9A84C;line-height:1;}
  .des-strength-label{font-size:10px;color:#445068;margin-top:2px;}
  .des-tabs{background:#0E1729;border-bottom:1px solid #1A2640;padding:0 28px;}
  .des-tabs-inner{max-width:1360px;margin:0 auto;display:flex;}
  .des-tab{background:none;border:none;border-bottom:2px solid transparent;cursor:pointer;padding:11px 20px;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:500;color:#5A6880;transition:all .2s;}
  .des-tab.active{color:#C9A84C;border-bottom-color:#C9A84C;}
  .des-tab:hover{color:#C9A84C;}
  .des-body{max-width:1360px;margin:0 auto;padding:26px 28px;}
  .des-kpi-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:14px;margin-bottom:24px;}
  .des-kpi{background:linear-gradient(135deg,#131D32,#0F1828);border:1px solid #1A2640;border-radius:12px;padding:20px 22px;transition:transform .2s,box-shadow .2s;}
  .des-kpi:hover{transform:translateY(-2px);box-shadow:0 8px 28px rgba(0,0,0,.5);}
  .des-kpi-label{font-size:10px;color:#445068;text-transform:uppercase;letter-spacing:.9px;margin-bottom:7px;}
  .des-kpi-val{font-size:30px;font-weight:700;line-height:1;}
  .des-kpi-sub{font-size:11px;color:#445068;margin-top:5px;}
  .des-chart-card{background:#131D32;border:1px solid #1A2640;border-radius:12px;padding:22px;}
  .des-chart-title{font-size:13px;font-weight:600;color:#C9A84C;margin-bottom:3px;}
  .des-chart-sub{font-size:11px;color:#445068;margin-bottom:18px;}
  .des-grid-2{display:grid;grid-template-columns:2fr 1fr;gap:18px;margin-bottom:18px;}
  .des-grid-eq{display:grid;grid-template-columns:1fr 1fr;gap:18px;margin-bottom:18px;}
  .des-filters{display:flex;gap:10px;margin-bottom:18px;flex-wrap:wrap;align-items:center;}
  .des-input{background:#0F1828;border:1px solid #1A2640;border-radius:8px;color:#E8EAF0;padding:9px 13px;font-family:'DM Sans',sans-serif;font-size:13px;outline:none;transition:border-color .2s;}
  .des-input:focus{border-color:#C9A84C;}
  .des-select{background:#0F1828;border:1px solid #1A2640;border-radius:8px;color:#E8EAF0;padding:9px 13px;font-family:'DM Sans',sans-serif;font-size:13px;outline:none;cursor:pointer;transition:border-color .2s;}
  .des-select:focus{border-color:#C9A84C;}
  .des-table-wrap{border-radius:12px;border:1px solid #1A2640;overflow-x:auto;}
  .des-table{width:100%;border-collapse:collapse;font-size:13px;}
  .des-table th{background:#0D1726;padding:11px 13px;text-align:left;font-size:10px;font-weight:600;color:#5A6880;text-transform:uppercase;letter-spacing:.8px;border-bottom:1px solid #1A2640;cursor:pointer;user-select:none;white-space:nowrap;}
  .des-table th:hover{color:#C9A84C;}
  .des-table td{padding:11px 13px;border-bottom:1px solid #162035;vertical-align:middle;}
  .des-table tr:last-child td{border-bottom:none;}
  .des-table tr:hover td{background:#0F1D30;}
  .des-badge{display:inline-block;padding:3px 9px;border-radius:20px;font-size:11px;font-weight:600;}
  .des-btn{border:none;cursor:pointer;border-radius:7px;font-family:'DM Sans',sans-serif;font-weight:600;transition:all .2s;}
  .des-btn-gold{background:linear-gradient(135deg,#C9A84C,#E8C96A);color:#0B1120;padding:10px 20px;font-size:13px;}
  .des-btn-gold:hover{box-shadow:0 4px 16px rgba(201,168,76,.4);transform:translateY(-1px);}
  .des-btn-sm-edit{background:#162240;color:#4C7FC9;padding:5px 11px;font-size:12px;}
  .des-btn-sm-edit:hover{background:#1C2E55;}
  .des-btn-sm-del{background:#2A1616;color:#C94C4C;padding:5px 11px;font-size:12px;}
  .des-btn-sm-del:hover{background:#351E1E;}
  .des-btn-cancel{background:#1A2640;color:#6A7890;padding:10px 20px;font-size:13px;}
  .des-btn-danger{background:linear-gradient(135deg,#C94C4C,#E86A6A);color:#fff;padding:10px 20px;font-size:13px;}
  .des-overlay{position:fixed;inset:0;background:rgba(0,0,0,.72);display:flex;align-items:center;justify-content:center;z-index:999;backdrop-filter:blur(4px);}
  .des-modal{background:#131D32;border:1px solid #2A3A5C;border-radius:16px;padding:30px;width:510px;max-width:95vw;max-height:90vh;overflow-y:auto;}
  .des-modal-title{font-family:'DM Serif Display',serif;font-size:19px;color:#C9A84C;margin-bottom:3px;}
  .des-modal-sub{font-size:12px;color:#445068;margin-bottom:22px;}
  .des-form-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px;}
  .des-field-label{font-size:10px;color:#6A7890;text-transform:uppercase;letter-spacing:.7px;display:block;margin-bottom:5px;}
  .des-progress-bg{height:6px;background:#182035;border-radius:3px;overflow:hidden;}
  .des-progress-fill{height:100%;border-radius:3px;transition:width .6s ease;}
  .des-strength-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:14px;}
  .des-strength-card{background:linear-gradient(135deg,#131D32,#0F1828);border:1px solid #1A2640;border-radius:12px;padding:20px;}
  .des-fade{animation:desFade .4s ease forwards;}
  @keyframes desFade{from{opacity:0;transform:translateY(8px);}to{opacity:1;transform:translateY(0);}}
  @media(max-width:900px){.des-grid-2,.des-grid-eq{grid-template-columns:1fr;}}
  @media(max-width:600px){.des-header-inner{flex-wrap:wrap;}.des-kpi-grid{grid-template-columns:1fr 1fr;}}
`;

export default function App() {
  const [emps, setEmps] = useState(INIT_EMPS);
  const [tab, setTab] = useState("overview");
  const [search, setSearch] = useState("");
  const [fCat, setFCat] = useState("All");
  const [fDiv, setFDiv] = useState("All");
  const [fStatus, setFStatus] = useState("All");
  const [modal, setModal] = useState(false);
  const [editEmp, setEditEmp] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [delId, setDelId] = useState(null);
  const [sortF, setSortF] = useState("name");
  const [sortD, setSortD] = useState("asc");

  const filtered = useMemo(() => emps
    .filter(e =>
      (fCat === "All" || e.category === fCat) &&
      (fDiv === "All" || e.division === fDiv) &&
      (fStatus === "All" || e.status === fStatus) &&
      (!search || e.name.toLowerCase().includes(search.toLowerCase()) || e.empId.toLowerCase().includes(search.toLowerCase()))
    )
    .sort((a, b) => {
      const va = a[sortF] || "", vb = b[sortF] || "";
      return sortD === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
    }), [emps, fCat, fDiv, fStatus, search, sortF, sortD]);

  const catData = useMemo(() => CATEGORIES.map((c, i) => ({
    name: c.length > 11 ? c.slice(0, 11) + "…" : c, full: c,
    actual: emps.filter(e => e.category === c).length,
    sanctioned: SANCTIONED[c], color: PALETTE[i],
  })), [emps]);

  const pieData = useMemo(() => CATEGORIES.map((c, i) => ({
    name: c, value: emps.filter(e => e.category === c).length, color: PALETTE[i],
  })).filter(d => d.value > 0), [emps]);

  const statusData = useMemo(() => STATUSES.map(s => ({
    name: s, value: emps.filter(e => e.status === s).length, color: STATUS_COLOR[s],
  })).filter(d => d.value > 0), [emps]);

  const divData = useMemo(() => DIVISIONS.map(d => ({
    name: d === "Headquarters" ? "HQ" : d === "Field Unit" ? "Field" : d.replace("South West ", "SW ").replace("Eastern West ", "EW ").replace(" Hills", ""),
    full: d,
    count: emps.filter(e => e.division === d).length,
  })), [emps]);

  const genderData = useMemo(() => [
    { name: "Male", value: emps.filter(e => e.gender === "Male").length, color: "#4C7FC9" },
    { name: "Female", value: emps.filter(e => e.gender === "Female").length, color: "#C94C9B" },
    { name: "Other", value: emps.filter(e => e.gender === "Other").length, color: "#4CC9C9" },
  ].filter(d => d.value > 0), [emps]);

  const totalSanctioned = Object.values(SANCTIONED).reduce((a, b) => a + b, 0);
  const totalActive = emps.filter(e => e.status === "Active").length;
  const vacancy = totalSanctioned - emps.length;

  const openAdd = () => { setEditEmp(null); setForm(EMPTY_FORM); setModal(true); };
  const openEdit = e => { setEditEmp(e); setForm({ ...e }); setModal(true); };
  const save = () => {
    if (!form.name || !form.empId) return;
    if (editEmp) setEmps(prev => prev.map(e => e.id === editEmp.id ? { ...form, id: editEmp.id } : e));
    else setEmps(prev => [...prev, { ...form, id: Date.now() }]);
    setModal(false);
  };
  const toggleSort = f => { if (sortF === f) setSortD(d => d === "asc" ? "desc" : "asc"); else { setSortF(f); setSortD("asc"); } };
  const sortArrow = f => sortF === f ? (sortD === "asc" ? " ↑" : " ↓") : "";

  const TT = ({ contentStyle: _, ...p }) => (
    <Tooltip {...p} contentStyle={{ background: "#162035", border: "1px solid #2A3A5C", borderRadius: 8, color: "#E8EAF0", fontSize: 12 }} />
  );

  return (
    <div className="des-wrap">
      <style>{css}</style>

      {/* Header */}
      <div className="des-header">
        <div className="des-header-inner">
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div className="des-logo">DES</div>
            <div>
              <div className="des-title">Directorate of Economics and Statistics, Meghalaya</div>
              <div className="des-subtitle">Human Resource Management System</div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div className="des-strength-badge">
              <div className="des-strength-num">{emps.length}<span style={{ fontSize: 13, color: "#445068" }}>/{totalSanctioned}</span></div>
              <div className="des-strength-label">Total / Sanctioned</div>
            </div>
            <button className="des-btn des-btn-gold" onClick={openAdd} style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <span style={{ fontSize: 17 }}>＋</span> Add Employee
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="des-tabs">
        <div className="des-tabs-inner">
          {[["overview","📊 Overview"],["directory","👥 Directory"],["analytics","📈 Analytics"],["strength","🏛 Strength Register"]].map(([k, l]) => (
            <button key={k} className={`des-tab${tab === k ? " active" : ""}`} onClick={() => setTab(k)}>{l}</button>
          ))}
        </div>
      </div>

      <div className="des-body">

        {/* OVERVIEW */}
        {tab === "overview" && (
          <div className="des-fade">
            <div className="des-kpi-grid">
              {[
                { label: "Total Employees", val: emps.length, sub: `of ${totalSanctioned} sanctioned posts`, color: "#C9A84C", icon: "👥" },
                { label: "Active Personnel", val: totalActive, sub: `${Math.round(totalActive / emps.length * 100)}% of workforce`, color: "#4CC97F", icon: "✅" },
                { label: "Vacancies", val: vacancy, sub: "Posts currently unfilled", color: "#C94C4C", icon: "📋" },
                { label: "On Leave / Deputed", val: emps.filter(e => e.status !== "Active" && e.status !== "Retired").length, sub: "Currently away", color: "#4C7FC9", icon: "🔄" },
                { label: "Operational Units", val: DIVISIONS.length, sub: "Headquarters + Districts", color: "#9B4CC9", icon: "🏢" },
                { label: "Post Categories", val: CATEGORIES.length, sub: "Distinct designations", color: "#4CC9C9", icon: "🗂" },
              ].map(({ label, val, sub, color, icon }) => (
                <div key={label} className="des-kpi">
                  <div className="des-kpi-label">{label}</div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                    <div className="des-kpi-val" style={{ color }}>{val}</div>
                    <span style={{ fontSize: 24, opacity: .65 }}>{icon}</span>
                  </div>
                  <div className="des-kpi-sub">{sub}</div>
                </div>
              ))}
            </div>

            <div className="des-grid-2">
              <div className="des-chart-card">
                <div className="des-chart-title">Category-wise Strength</div>
                <div className="des-chart-sub">Actual posts filled vs sanctioned strength</div>
                <ResponsiveContainer width="100%" height={270}>
                  <BarChart data={catData} margin={{ left: -8, bottom: 34 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#162035" />
                    <XAxis dataKey="name" tick={{ fill: "#5A6880", fontSize: 10 }} angle={-38} textAnchor="end" interval={0} />
                    <YAxis tick={{ fill: "#5A6880", fontSize: 11 }} />
                    <TT formatter={(v, n) => [v, n === "actual" ? "Actual" : "Sanctioned"]} labelFormatter={(l, p) => p?.[0]?.payload?.full || l} />
                    <Bar dataKey="sanctioned" fill="#1A2640" name="Sanctioned" radius={[3,3,0,0]} />
                    <Bar dataKey="actual" name="Actual" radius={[3,3,0,0]}>
                      {catData.map((e, i) => <Cell key={i} fill={e.color} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="des-chart-card">
                <div className="des-chart-title">Employment Status</div>
                <div className="des-chart-sub">Current workforce status breakdown</div>
                <ResponsiveContainer width="100%" height={160}>
                  <PieChart>
                    <Pie data={statusData} cx="50%" cy="50%" innerRadius={42} outerRadius={65} dataKey="value" paddingAngle={3}>
                      {statusData.map((e, i) => <Cell key={i} fill={e.color} />)}
                    </Pie>
                    <TT />
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ display: "flex", flexDirection: "column", gap: 9, marginTop: 10 }}>
                  {statusData.map(s => (
                    <div key={s.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ width: 8, height: 8, borderRadius: 2, background: s.color }} />
                        <span style={{ fontSize: 12, color: "#9AA0B8" }}>{s.name}</span>
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 700, color: s.color }}>{s.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="des-grid-eq">
              <div className="des-chart-card">
                <div className="des-chart-title">Division-wise Deployment</div>
                <div className="des-chart-sub">Employee count per operational unit</div>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={divData} layout="vertical" margin={{ left: 4 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#162035" horizontal={false} />
                    <XAxis type="number" tick={{ fill: "#5A6880", fontSize: 11 }} />
                    <YAxis type="category" dataKey="name" tick={{ fill: "#9AA0B8", fontSize: 11 }} width={80} />
                    <TT labelFormatter={(l, p) => p?.[0]?.payload?.full || l} />
                    <Bar dataKey="count" fill="#4C7FC9" radius={[0,4,4,0]} name="Employees" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="des-chart-card">
                <div className="des-chart-title">Gender Composition</div>
                <div className="des-chart-sub">Workforce diversity overview</div>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={genderData} cx="50%" cy="50%" outerRadius={72} dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent*100).toFixed(0)}%`}
                      labelLine={{ stroke: "#2A3A5C" }}>
                      {genderData.map((e, i) => <Cell key={i} fill={e.color} />)}
                    </Pie>
                    <TT />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* DIRECTORY */}
        {tab === "directory" && (
          <div className="des-fade">
            <div className="des-filters">
              <input className="des-input" style={{ width: 230 }} placeholder="🔍  Search name or ID…" value={search} onChange={e => setSearch(e.target.value)} />
              <select className="des-select" value={fCat} onChange={e => setFCat(e.target.value)} style={{ width: 195 }}>
                <option value="All">All Categories</option>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
              <select className="des-select" value={fDiv} onChange={e => setFDiv(e.target.value)} style={{ width: 175 }}>
                <option value="All">All Divisions</option>
                {DIVISIONS.map(d => <option key={d}>{d}</option>)}
              </select>
              <select className="des-select" value={fStatus} onChange={e => setFStatus(e.target.value)} style={{ width: 155 }}>
                <option value="All">All Status</option>
                {STATUSES.map(s => <option key={s}>{s}</option>)}
              </select>
              <div style={{ marginLeft: "auto", fontSize: 12, color: "#445068" }}>
                <span style={{ color: "#C9A84C", fontWeight: 600 }}>{filtered.length}</span> records
              </div>
            </div>

            <div className="des-table-wrap">
              <table className="des-table">
                <thead>
                  <tr>
                    {[["empId","Emp ID"],["name","Name"],["category","Category"],["division","Division"],["gender","Gender"],["status","Status"],["joinDate","Join Date"]].map(([f,l]) => (
                      <th key={f} onClick={() => toggleSort(f)}>{l}{sortArrow(f)}</th>
                    ))}
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(emp => (
                    <tr key={emp.id}>
                      <td><span style={{ fontFamily: "monospace", color: "#C9A84C", fontSize: 12 }}>{emp.empId}</span></td>
                      <td><span style={{ fontWeight: 600 }}>{emp.name}</span></td>
                      <td><span style={{ color: "#9AA0B8", fontSize: 12 }}>{emp.category}</span></td>
                      <td><span style={{ color: "#6A7890", fontSize: 12 }}>{emp.division}</span></td>
                      <td><span style={{ color: "#9AA0B8" }}>{emp.gender}</span></td>
                      <td>
                        <span className="des-badge" style={{ background: STATUS_COLOR[emp.status] + "20", color: STATUS_COLOR[emp.status], border: `1px solid ${STATUS_COLOR[emp.status]}40` }}>
                          {emp.status}
                        </span>
                      </td>
                      <td><span style={{ color: "#6A7890", fontSize: 12 }}>{emp.joinDate}</span></td>
                      <td>
                        <div style={{ display: "flex", gap: 6 }}>
                          <button className="des-btn des-btn-sm-edit" onClick={() => openEdit(emp)}>Edit</button>
                          <button className="des-btn des-btn-sm-del" onClick={() => setDelId(emp.id)}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr><td colSpan={8} style={{ textAlign: "center", padding: 44, color: "#445068" }}>No matching records found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ANALYTICS */}
        {tab === "analytics" && (
          <div className="des-fade">
            <div className="des-grid-eq" style={{ marginBottom: 18 }}>
              <div className="des-chart-card">
                <div className="des-chart-title">Category Distribution</div>
                <div className="des-chart-sub">Proportion of posts across all categories</div>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" outerRadius={100} innerRadius={45} dataKey="value" paddingAngle={2}>
                      {pieData.map((e, i) => <Cell key={i} fill={e.color} />)}
                    </Pie>
                    <TT />
                    <Legend wrapperStyle={{ fontSize: 11, color: "#6A7890" }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="des-chart-card">
                <div className="des-chart-title">Vacancy Fill Rate</div>
                <div className="des-chart-sub">Posts filled as % of sanctioned strength</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 12, overflowY: "auto", maxHeight: 316 }}>
                  {catData.map(c => {
                    const pct = c.sanctioned > 0 ? Math.min(100, Math.round(c.actual / c.sanctioned * 100)) : 0;
                    const vac = c.sanctioned - c.actual;
                    return (
                      <div key={c.full}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                          <span style={{ fontSize: 12, color: "#9AA0B8" }}>{c.full}</span>
                          <span style={{ fontSize: 11, fontWeight: 700, color: vac > 0 ? "#C94C4C" : "#4CC97F" }}>
                            {vac > 0 ? `${vac} vacant` : "✓ Full"}
                          </span>
                        </div>
                        <div className="des-progress-bg">
                          <div className="des-progress-fill" style={{ width: `${pct}%`, background: pct >= 90 ? "#4CC97F" : pct >= 60 ? "#C9A84C" : "#C94C4C" }} />
                        </div>
                        <div style={{ fontSize: 10, color: "#445068", marginTop: 3 }}>{c.actual}/{c.sanctioned} ({pct}%)</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="des-chart-card">
              <div className="des-chart-title">Sanctioned vs Actual — Complete Comparison</div>
              <div className="des-chart-sub">Workforce gap analysis across all post categories</div>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={catData} margin={{ left: -8, bottom: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#162035" />
                  <XAxis dataKey="name" tick={{ fill: "#5A6880", fontSize: 10 }} angle={-35} textAnchor="end" interval={0} />
                  <YAxis tick={{ fill: "#5A6880", fontSize: 11 }} />
                  <TT formatter={(v, n) => [v, n]} labelFormatter={(l, p) => p?.[0]?.payload?.full || l} />
                  <Legend wrapperStyle={{ fontSize: 12, color: "#6A7890", paddingTop: 42 }} />
                  <Bar dataKey="sanctioned" name="Sanctioned" fill="#2A3A5C" radius={[3,3,0,0]} />
                  <Bar dataKey="actual" name="Actual" fill="#C9A84C" radius={[3,3,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* STRENGTH REGISTER */}
        {tab === "strength" && (
          <div className="des-fade">
            <div style={{ marginBottom: 18, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 18, color: "#C9A84C" }}>Sanctioned Strength Register</div>
                <div style={{ fontSize: 12, color: "#445068", marginTop: 2 }}>Post-wise deployment and vacancy status</div>
              </div>
              <div style={{ display: "flex", gap: 24 }}>
                <div style={{ textAlign: "center" }}><div style={{ fontSize: 22, fontWeight: 700, color: "#4CC97F" }}>{emps.length}</div><div style={{ fontSize: 10, color: "#445068" }}>Filled</div></div>
                <div style={{ textAlign: "center" }}><div style={{ fontSize: 22, fontWeight: 700, color: "#C94C4C" }}>{vacancy}</div><div style={{ fontSize: 10, color: "#445068" }}>Vacant</div></div>
                <div style={{ textAlign: "center" }}><div style={{ fontSize: 22, fontWeight: 700, color: "#C9A84C" }}>{totalSanctioned}</div><div style={{ fontSize: 10, color: "#445068" }}>Sanctioned</div></div>
              </div>
            </div>
            <div className="des-strength-grid">
              {CATEGORIES.map((cat, i) => {
                const actual = emps.filter(e => e.category === cat).length;
                const sanctioned = SANCTIONED[cat];
                const pct = Math.min(100, Math.round(actual / sanctioned * 100));
                const catEmps = emps.filter(e => e.category === cat);
                return (
                  <div key={cat} className="des-strength-card">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: "#E8EAF0", marginBottom: 2 }}>{cat}</div>
                        <div style={{ fontSize: 10, color: "#445068" }}>Sanctioned: {sanctioned} posts</div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 26, fontWeight: 700, color: PALETTE[i] }}>{actual}</div>
                        <div style={{ fontSize: 10, color: sanctioned - actual > 0 ? "#C94C4C" : "#4CC97F" }}>
                          {sanctioned - actual > 0 ? `${sanctioned - actual} vacant` : "✓ Full"}
                        </div>
                      </div>
                    </div>
                    <div className="des-progress-bg" style={{ marginBottom: 11 }}>
                      <div className="des-progress-fill" style={{ width: `${pct}%`, background: PALETTE[i] }} />
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                      {catEmps.slice(0, 3).map(e => (
                        <span key={e.id} style={{ fontSize: 10, color: "#6A7890", background: "#0F1828", padding: "2px 8px", borderRadius: 4, border: "1px solid #1A2640" }}>
                          {e.name.split(" ").slice(0, 2).join(" ")}
                        </span>
                      ))}
                      {catEmps.length > 3 && <span style={{ fontSize: 10, color: "#445068" }}>+{catEmps.length - 3} more</span>}
                      {catEmps.length === 0 && <span style={{ fontSize: 10, color: "#C94C4C" }}>No employees assigned</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {modal && (
        <div className="des-overlay" onClick={e => e.target === e.currentTarget && setModal(false)}>
          <div className="des-modal">
            <div className="des-modal-title">{editEmp ? "Edit Employee Record" : "Add New Employee"}</div>
            <div className="des-modal-sub">{editEmp ? `Updating record: ${editEmp.empId}` : "Enter details to create a new employee record"}</div>
            <div className="des-form-grid">
              <div>
                <label className="des-field-label">Employee ID</label>
                <input className="des-input" style={{ width: "100%" }} placeholder="e.g. DES-026" value={form.empId} onChange={e => setForm(f => ({ ...f, empId: e.target.value }))} />
              </div>
              <div>
                <label className="des-field-label">Full Name</label>
                <input className="des-input" style={{ width: "100%" }} placeholder="Full name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              </div>
              <div>
                <label className="des-field-label">Category</label>
                <select className="des-select" style={{ width: "100%" }} value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="des-field-label">Division</label>
                <select className="des-select" style={{ width: "100%" }} value={form.division} onChange={e => setForm(f => ({ ...f, division: e.target.value }))}>
                  {DIVISIONS.map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="des-field-label">Gender</label>
                <select className="des-select" style={{ width: "100%" }} value={form.gender} onChange={e => setForm(f => ({ ...f, gender: e.target.value }))}>
                  {GENDERS.map(g => <option key={g}>{g}</option>)}
                </select>
              </div>
              <div>
                <label className="des-field-label">Status</label>
                <select className="des-select" style={{ width: "100%" }} value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                  {STATUSES.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div style={{ gridColumn: "span 2" }}>
                <label className="des-field-label">Date of Joining</label>
                <input className="des-input" type="date" style={{ width: "100%" }} value={form.joinDate} onChange={e => setForm(f => ({ ...f, joinDate: e.target.value }))} />
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 26, justifyContent: "flex-end" }}>
              <button className="des-btn des-btn-cancel" onClick={() => setModal(false)}>Cancel</button>
              <button className="des-btn des-btn-gold" onClick={save}>{editEmp ? "Save Changes" : "Add Employee"}</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {delId && (
        <div className="des-overlay" onClick={e => e.target === e.currentTarget && setDelId(null)}>
          <div className="des-modal" style={{ width: 370 }}>
            <div style={{ textAlign: "center", fontSize: 36, marginBottom: 14 }}>⚠️</div>
            <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 19, color: "#C94C4C", textAlign: "center", marginBottom: 8 }}>Confirm Deletion</div>
            <div style={{ fontSize: 13, color: "#6A7890", textAlign: "center", marginBottom: 26 }}>This will permanently remove the employee record. This action cannot be undone.</div>
            <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
              <button className="des-btn des-btn-cancel" onClick={() => setDelId(null)}>Cancel</button>
              <button className="des-btn des-btn-danger" onClick={() => { setEmps(p => p.filter(e => e.id !== delId)); setDelId(null); }}>Delete Record</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
