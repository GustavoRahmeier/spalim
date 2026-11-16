const WA = "5551983164305"; /* WhatsApp da loja Spalim (DDI 55 + DDD 51) */
const KEY = "spalim-products";
const SAMPLE = [
  {
    c: "FEM-001",
    n: "Blusa em tricô",
    g: "fem",
    p: 129.9,
    z: ["P", "M", "G"],
    k: [
      ["Bege", "#D8C8B0"],
      ["Preto", "#2b2b2b"],
      ["Rosé", "#D9A5A0"],
    ],
    f: ["new"],
  },
  {
    c: "FEM-002",
    n: "Blusa térmica",
    g: "fem",
    p: 89.9,
    z: ["P", "M", "G", "GG"],
    k: [
      ["Preto", "#2b2b2b"],
      ["Off-white", "#EFEAE2"],
      ["Cinza", "#A3A3A3"],
    ],
    f: ["new"],
  },
  {
    c: "FEM-003",
    n: "Calça jeans",
    g: "fem",
    p: 159.9,
    z: ["36", "38", "40", "42", "44"],
    k: [
      ["Azul claro", "#8FB0D0"],
      ["Azul escuro", "#2F4B73"],
    ],
    f: ["new"],
  },
  {
    c: "FEM-004",
    n: "Saia jeans",
    g: "fem",
    p: 119.9,
    z: ["36", "38", "40", "42"],
    k: [["Jeans", "#34518a"]],
    f: ["best"],
  },
  {
    c: "FEM-005",
    n: "Camiseta básica",
    g: "fem",
    p: 49.9,
    z: ["P", "M", "G"],
    k: [
      ["Branco", "#F5F5F5"],
      ["Rosé", "#D9A5A0"],
      ["Preto", "#2b2b2b"],
    ],
    f: ["best"],
  },
  {
    c: "FEM-006",
    n: "Cardigã leve",
    g: "fem",
    p: 79.9,
    o: 119.9,
    z: ["P", "M", "G"],
    k: [
      ["Cinza", "#B5B5B5"],
      ["Bege", "#D8C8B0"],
    ],
    f: ["out"],
  },
  {
    c: "MAS-001",
    n: "Jaqueta em sarja",
    g: "mas",
    p: 199.9,
    z: ["P", "M", "G", "GG"],
    k: [
      ["Verde-oliva", "#6B705C"],
      ["Bege", "#CDBFA6"],
    ],
    f: ["new"],
  },
  {
    c: "MAS-002",
    n: "Tricô masculino",
    g: "mas",
    p: 169.9,
    z: ["P", "M", "G", "GG"],
    k: [
      ["Preto", "#2b2b2b"],
      ["Grafite", "#4d4d4d"],
      ["Cinza", "#A3A3A3"],
    ],
    f: ["new"],
  },
  {
    c: "MAS-003",
    n: "Calça sarja",
    g: "mas",
    p: 149.9,
    z: ["38", "40", "42", "44", "46"],
    k: [
      ["Bege", "#CBB994"],
      ["Cinza", "#8a8a8a"],
      ["Preto", "#2b2b2b"],
    ],
    f: ["new", "best"],
  },
  {
    c: "MAS-004",
    n: "Camiseta básica",
    g: "mas",
    p: 49.9,
    z: ["P", "M", "G", "GG"],
    k: [
      ["Branco", "#F5F5F5"],
      ["Preto", "#2b2b2b"],
      ["Cinza", "#A3A3A3"],
    ],
    f: ["best"],
  },
  {
    c: "MAS-005",
    n: "Camiseta polo",
    g: "mas",
    p: 59.9,
    o: 89.9,
    z: ["M", "G", "GG"],
    k: [
      ["Azul-marinho", "#25344f"],
      ["Branco", "#F5F5F5"],
    ],
    f: ["out"],
  },
];
const F = [
  ["all", "Tudo"],
  ["fem", "Feminino"],
  ["mas", "Masculino"],
  ["new", "Novidades"],
  ["best", "Mais vendidos"],
  ["out", "Outlet"],
];
const $ = (s) => document.querySelector(s),
  brl = (n) =>
    n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const esc = (s) =>
  String(s).replace(
    /[&<>"]/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c],
  );
let P = [],
  usingSample = false,
  flt = "new",
  qry = "",
  cart = [];
try {
  cart = JSON.parse(localStorage.getItem("spalim-cart") || "[]");
} catch (e) {}
const save = () => {
  try {
    localStorage.setItem("spalim-cart", JSON.stringify(cart));
  } catch (e) {}
};
const toast = (m) => {
  const t = $("#toast");
  t.textContent = m;
  t.classList.add("on");
  clearTimeout(toast.h);
  toast.h = setTimeout(() => t.classList.remove("on"), 2600);
};

/* catálogo: salvo no navegador (admin) > produtos.json do site > exemplos */
const norm = (p) => ({
  c: String(p.c),
  n: String(p.n),
  g: p.g === "mas" ? "mas" : "fem",
  p: +p.p || 0,
  ...(+p.o > 0 ? { o: +p.o } : {}),
  z: (p.z || []).map(String),
  k: (p.k && p.k.length ? p.k : [["Único", "#A3A3A3"]]).map((c) => [
    String(c[0]),
    /^#[0-9a-f]{6}$/i.test(c[1]) ? c[1] : "#A3A3A3",
  ]),
  f: (p.f || []).map(String),
  img: (p.img || []).filter(
    (u) => typeof u === "string" && /^(data:image\/|https?:|[\w./-]+$)/.test(u),
  ),
});
const saveP = () => {
  try {
    localStorage.setItem(KEY, JSON.stringify(P));
    return true;
  } catch (e) {
    toast("Sem espaço para salvar. Use fotos menores ou exporte o catálogo.");
    return false;
  }
};
async function loadP() {
  try {
    const s = localStorage.getItem(KEY);
    if (s) {
      P = JSON.parse(s).map(norm);
      return;
    }
  } catch (e) {}
  try {
    const r = await fetch("produtos.json", { cache: "no-store" });
    if (r.ok) {
      const j = await r.json();
      if (Array.isArray(j)) {
        P = j.map(norm);
        return;
      }
    }
  } catch (e) {}
  P = SAMPLE.map(norm);
  usingSample = true;
}
const pic = (p, i = 0) =>
  p.img[i]
    ? `<img src="${esc(p.img[i])}" alt="${esc(p.n)}" loading="lazy">`
    : `<span class="nf">Foto em breve</span>`;
const isOut = (p) => p.o || p.f.includes("out");

/* vitrine */
function render() {
  const q = qry.trim().toLowerCase();
  const L = P.filter(
    (p) =>
      (flt === "all" ||
        p.g === flt ||
        p.f.includes(flt) ||
        (flt === "out" && p.o)) &&
      (!q ||
        (p.n + " " + p.c + " " + p.k.map((k) => k[0]).join(" "))
          .toLowerCase()
          .includes(q)),
  );
  const nm = F.find((f) => f[0] === flt)[1];
  $("#ct").textContent = q
    ? "Resultados"
    : nm === "Tudo"
      ? "Toda a coleção"
      : nm;
  $("#grid").innerHTML = L.length
    ? L.map(
        (p) =>
          `<button class="card" data-c="${esc(p.c)}"><div class="tile">${pic(p)}${isOut(p) ? `<span class="tag out">Outlet</span>` : p.f.includes("new") ? `<span class="tag">Novo</span>` : ""}<span class="dots">${p.k.map((k) => `<i style="background:${k[1]}"></i>`).join("")}</span></div><h3>${esc(p.n)}</h3><p>${p.o ? `<s>${brl(p.o)}</s>` : ""}${brl(p.p)}</p></button>`,
      ).join("")
    : `<p class="empty">${P.length ? "Nenhuma peça encontrada. Tente outra palavra ou veja a coleção completa." : "Novas peças chegando em breve."}</p>`;
  $("#chips").innerHTML = F.map(
    (f) =>
      `<button class="chip" data-f="${f[0]}" aria-pressed="${f[0] === flt}">${f[1]}</button>`,
  ).join("");
  $("#nav").innerHTML = F.slice(1)
    .map(
      (f) =>
        `<button data-f="${f[0]}" ${f[0] === flt ? 'aria-current="true"' : ""}>${f[1]}</button>`,
    )
    .join("");
}
function go(f, scroll = true) {
  flt = f;
  qry = "";
  $("#q").value = "";
  render();
  if (scroll) $("#colecao").scrollIntoView();
}
document.addEventListener("click", (e) => {
  const f = e.target.closest("[data-f]");
  if (f) return go(f.dataset.f, f.closest("nav"));
  const g = e.target.closest("[data-go]");
  if (g) {
    e.preventDefault();
    return go(g.dataset.go);
  }
  const c = e.target.closest("[data-c]");
  if (c) openP(c.dataset.c);
});
$("#q").addEventListener("input", (e) => {
  qry = e.target.value;
  flt = "all";
  render();
  if (qry) $("#colecao").scrollIntoView();
});

/* peça */
let sel = {};
function openP(code) {
  const p = P.find((x) => x.c === code);
  if (!p) return;
  sel = { p, z: null, k: 0, q: 1, i: 0 };
  drawP();
  $("#pm").showModal();
}
function drawP() {
  const { p, z, k, q, i } = sel,
    d = $("#pm");
  d.innerHTML = `<button class="x" id="px" aria-label="Fechar">×</button><div class="pgrid"><div><div class="tile">${pic(p, i)}</div>${p.img.length > 1 ? `<div class="thumbs">${p.img.map((u, n) => `<button data-i="${n}" aria-label="Foto ${n + 1}" aria-current="${n === i}"><img src="${esc(u)}" alt=""></button>`).join("")}</div>` : ""}</div><div class="pinfo"><div><h2>${esc(p.n)}</h2><div class="code">Código ${esc(p.c)}</div></div><div class="price">${p.o ? `<s style="color:var(--mid);font-weight:400;font-size:1rem;margin-right:8px">${brl(p.o)}</s>` : ""}${brl(p.p)}</div>
 <div><div class="lbl">Cor <span>${esc(p.k[k][0])}</span></div><div class="opts" role="radiogroup" aria-label="Cor">${p.k.map((c, n) => `<button class="sw" role="radio" aria-checked="${n === k}" aria-label="${esc(c[0])}" data-k="${n}" style="background:${c[1]}"></button>`).join("")}</div></div>
 <div><div class="lbl">Tamanho <span>${esc(z || "escolha um")}</span></div><div class="opts" role="radiogroup" aria-label="Tamanho">${p.z.map((s) => `<button class="sz" role="radio" aria-checked="${s === z}" data-z="${esc(s)}">${esc(s)}</button>`).join("")}</div></div>
 <div><div class="lbl">Quantidade</div><div class="qty"><button data-q="-1" aria-label="Diminuir">−</button><output>${q}</output><button data-q="1" aria-label="Aumentar">+</button></div></div>
 <p class="err" id="er"></p><button class="btn" id="add">Adicionar ao pedido</button><button class="btn ghost" id="now" style="margin:0">Pedir só esta peça pelo WhatsApp</button></div></div>`;
  d.querySelector("#px").onclick = () => d.close();
  d.querySelectorAll("[data-i]").forEach(
    (b) =>
      (b.onclick = () => {
        sel.i = +b.dataset.i;
        drawP();
      }),
  );
  d.querySelectorAll("[data-k]").forEach(
    (b) =>
      (b.onclick = () => {
        sel.k = +b.dataset.k;
        drawP();
        d.querySelector(`[data-k="${sel.k}"]`).focus();
      }),
  );
  d.querySelectorAll("[data-z]").forEach(
    (b) =>
      (b.onclick = () => {
        sel.z = b.dataset.z;
        drawP();
        d.querySelector(`[data-z="${CSS.escape(sel.z)}"]`).focus();
      }),
  );
  d.querySelectorAll("[data-q]").forEach(
    (b) =>
      (b.onclick = () => {
        sel.q = Math.max(1, Math.min(9, sel.q + +b.dataset.q));
        drawP();
        d.querySelector(`[data-q="${b.dataset.q}"]`).focus();
      }),
  );
  d.querySelector("#now").onclick = () => {
    if (!sel.z) {
      d.querySelector("#er").textContent = "Escolha um tamanho para continuar.";
      return;
    }
    window.open(
      `https://wa.me/${WA}?text=${encodeURIComponent(msg([{ c: p.c, z: sel.z, k: p.k[sel.k][0], q: sel.q }]))}`,
      "_blank",
      "noopener",
    );
  };
  d.querySelector("#add").onclick = () => {
    if (!sel.z) {
      d.querySelector("#er").textContent = "Escolha um tamanho para continuar.";
      return;
    }
    const cl = p.k[sel.k][0],
      ex = cart.find((x) => x.c === p.c && x.z === sel.z && x.k === cl);
    ex
      ? (ex.q = Math.min(9, ex.q + sel.q))
      : cart.push({ c: p.c, z: sel.z, k: cl, q: sel.q });
    save();
    count();
    d.close();
    toast("Peça adicionada ao pedido");
  };
}
$("#pm").addEventListener("click", (e) => {
  if (e.target.id === "pm") e.target.close();
});

/* pedido */
const count = () => ($("#cc").textContent = cart.reduce((a, i) => a + i.q, 0));
const prod = (i) => P.find((p) => p.c === i.c);
const msg = (l = cart) =>
  "Olá, Spalim! 🧡\nGostaria de fazer um pedido pela vitrine virtual.\n\n" +
  l
    .map(
      (i) =>
        `Produto: ${prod(i).n} (${i.c})\nTamanho: ${i.z}\nCor: ${i.k}\nQuantidade: ${i.q}`,
    )
    .join("\n\n") +
  "\n\nGostaria de confirmar a disponibilidade e combinar o pagamento e a entrega.";
const wa = () =>
  `https://wa.me/${WA}?text=${encodeURIComponent(cart.length ? msg() : "Olá, Spalim! 🧡")}`;
function drawC() {
  const tot = cart.reduce((a, i) => a + prod(i).p * i.q, 0);
  $("#items").innerHTML = cart.length
    ? cart
        .map((i, n) => {
          const p = prod(i);
          return `<div class="it"><div class="tile">${pic(p)}</div><div><h4>${esc(p.n)}</h4><small>${esc(i.k)} · Tam. ${esc(i.z)}</small><div class="qty"><button data-m="${n}" data-d="-1" aria-label="Diminuir">−</button><output>${i.q}</output><button data-m="${n}" data-d="1" aria-label="Aumentar">+</button></div></div><div style="text-align:right"><b>${brl(p.p * i.q)}</b><br><button class="rm" data-r="${n}">Remover</button></div></div>`;
        })
        .join("")
    : `<p style="color:var(--muted);padding:24px 0">Seu pedido está vazio. Escolha uma peça na vitrine para começar.</p>`;
  $("#foot").innerHTML = cart.length
    ? `<div class="tot"><span>Total estimado</span><span>${brl(tot)}</span></div><a class="btn wa" href="${wa()}" target="_blank" rel="noopener">Enviar pedido pelo WhatsApp</a><details><summary>Ver mensagem que enviaremos</summary><pre></pre></details><p class="fine">Confirmamos a disponibilidade e combinamos pagamento e entrega pelo WhatsApp. Crediário só para clientes com cadastro na loja.</p>`
    : `<button class="btn" id="back">Continuar vendo peças</button>`;
  const pre = $("#foot pre");
  if (pre) pre.textContent = msg();
  const bk = $("#back");
  if (bk) bk.onclick = () => $("#cd").close();
}
$("#oc").onclick = () => {
  drawC();
  $("#cd").showModal();
};
$("#cx").onclick = () => $("#cd").close();
$("#cd").addEventListener("click", (e) => {
  if (e.target.id === "cd") return e.target.close();
  const m = e.target.dataset;
  if (m.m !== undefined) {
    const i = cart[+m.m];
    i.q = Math.max(1, Math.min(9, i.q + +m.d));
  } else if (m.r !== undefined) cart.splice(+m.r, 1);
  else return;
  save();
  count();
  drawC();
});
$("#fwa").href = `https://wa.me/${WA}`;

/* área da loja: cadastrar e remover peças */
let adm = { v: "list", f: null, arm: null };
const num = (s) => parseFloat(String(s).replace(",", "."));
const nextCode = (g) => {
  const pre = g === "mas" ? "MAS" : "FEM";
  return (
    pre +
    "-" +
    String(
      Math.max(
        0,
        ...P.filter((x) => x.c.startsWith(pre)).map(
          (x) => parseInt(x.c.slice(4)) || 0,
        ),
      ) + 1,
    ).padStart(3, "0")
  );
};
const shrink = (file) =>
  new Promise((ok, no) => {
    const r = new FileReader();
    r.onload = () => {
      const im = new Image();
      im.onload = () => {
        const s = Math.min(1, 900 / Math.max(im.width, im.height)),
          c = document.createElement("canvas");
        c.width = Math.round(im.width * s);
        c.height = Math.round(im.height * s);
        c.getContext("2d").drawImage(im, 0, 0, c.width, c.height);
        ok(c.toDataURL("image/jpeg", 0.82));
      };
      im.onerror = no;
      im.src = r.result;
    };
    r.onerror = no;
    r.readAsDataURL(file);
  });
function commit() {
  usingSample = false;
  saveP();
  $("#fn").hidden = true;
  render();
  drawA();
}
function exportP() {
  try {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(
      new Blob([JSON.stringify(P)], { type: "application/json" }),
    );
    a.download = "produtos.json";
    document.body.appendChild(a);
    a.click();
    a.remove();
    toast("Arquivo produtos.json gerado");
  } catch (e) {
    toast("Não foi possível exportar aqui");
  }
}
function readF() {
  const d = $("#ad"),
    f = adm.f,
    v = (n) => d.querySelector(`[name="${n}"]`);
  if (!v("n")) return;
  f.n = v("n").value;
  f.g = v("g").value;
  f.p = v("p").value;
  f.o = v("o").value;
  f.z = v("z").value;
  f.f = ["new", "best"].filter((t) => v(t).checked);
  d.querySelectorAll("[data-ci]").forEach((el) => {
    f.k[+el.dataset.ci][el.dataset.t === "hex" ? 1 : 0] = el.value;
  });
}
function drawA() {
  const d = $("#ad"),
    f = adm.f;
  if (adm.v === "list") {
    d.innerHTML = `<div class="ain"><button class="x" id="ax" aria-label="Fechar">×</button><h2 style="font-size:2rem">Gerenciar peças</h2>
  <p class="fine" style="margin-top:6px">As alterações ficam salvas neste navegador. Para o site de todos verem, use Exportar e envie o arquivo produtos.json para a hospedagem, na mesma pasta do site.</p>
  <div class="atools"><button class="btn" id="anew">Nova peça</button><button class="btn ghost" id="aexp" style="margin:0">Exportar</button><label class="btn ghost" style="margin:0;cursor:pointer">Importar<input type="file" id="aimp" accept="application/json" hidden></label></div>
  ${P.length ? P.map((p) => `<div class="ar"><div class="tile">${pic(p)}</div><div><b>${esc(p.n)}</b><br><small style="color:var(--muted)">${esc(p.c)} · ${brl(p.p)}</small></div><button class="rm" data-del="${esc(p.c)}">${adm.arm === p.c ? "Confirmar remoção" : "Remover"}</button></div>`).join("") : `<p style="color:var(--muted);padding:20px 0">Nenhuma peça cadastrada.</p>`}</div>`;
  } else {
    d.innerHTML = `<div class="ain"><button class="x" id="ax" aria-label="Fechar">×</button><h2 style="font-size:2rem;margin-bottom:18px">Nova peça</h2>
  <label class="fld">Nome da peça<input name="n" maxlength="60" value="${esc(f.n)}" placeholder="Ex.: Blusa em tricô"></label>
  <div class="row2"><label class="fld">Categoria<select name="g"><option value="fem" ${f.g === "fem" ? "selected" : ""}>Feminino</option><option value="mas" ${f.g === "mas" ? "selected" : ""}>Masculino</option></select></label>
  <label class="fld">Preço (R$)<input name="p" inputmode="decimal" value="${esc(f.p)}" placeholder="129,90"></label></div>
  <div class="row2"><label class="fld">Preço antigo (outlet)<input name="o" inputmode="decimal" value="${esc(f.o)}" placeholder="opcional"></label>
  <label class="fld">Tamanhos<input name="z" value="${esc(f.z)}" placeholder="P, M, G"></label></div>
  <div class="lbl">Cores</div>${f.k.map((c, i) => `<div class="cr"><input type="color" value="${c[1]}" data-ci="${i}" data-t="hex" aria-label="Cor"><input type="text" value="${esc(c[0])}" data-ci="${i}" data-t="name" placeholder="Nome da cor"><button class="rm" data-crm="${i}">Remover</button></div>`).join("")}
  <button class="rm" id="acadd" style="margin-bottom:16px">+ Adicionar cor</button>
  <div class="chk"><label><input type="checkbox" name="new" ${f.f.includes("new") ? "checked" : ""}> Novidade</label><label><input type="checkbox" name="best" ${f.f.includes("best") ? "checked" : ""}> Mais vendido</label></div>
  <label class="fld">Fotos (até 6, a primeira é a capa)<input type="file" id="aph" accept="image/*" multiple></label>
  <div class="ph">${f.img.map((u, i) => `<div><img src="${u}" alt=""><button data-iprm="${i}" aria-label="Remover foto">×</button></div>`).join("")}</div>
  <p class="err" id="aer" style="margin-top:12px"></p>
  <div class="atools"><button class="btn" id="asave">Salvar peça</button><button class="btn ghost" id="acancel" style="margin:0">Cancelar</button></div></div>`;
  }
}
$("#ad").addEventListener("click", (e) => {
  const t = e.target,
    d = $("#ad"),
    B = (id) => t.closest("#" + id);
  if (t.id === "ad" || B("ax")) return d.close();
  if (B("anew")) {
    adm = {
      v: "form",
      f: {
        n: "",
        g: "fem",
        p: "",
        o: "",
        z: "P, M, G",
        k: [["", "#A3A3A3"]],
        f: ["new"],
        img: [],
      },
      arm: null,
    };
    return drawA();
  }
  if (B("aexp")) return exportP();
  const del = t.closest("[data-del]");
  if (del) {
    const c = del.dataset.del;
    if (adm.arm === c) {
      P = P.filter((x) => x.c !== c);
      cart = cart.filter((i) => i.c !== c);
      save();
      count();
      adm.arm = null;
      commit();
      toast("Peça removida");
    } else {
      adm.arm = c;
      drawA();
    }
    return;
  }
  if (B("acancel")) {
    adm.v = "list";
    return drawA();
  }
  if (B("acadd")) {
    readF();
    adm.f.k.push(["", "#A3A3A3"]);
    return drawA();
  }
  const cr = t.closest("[data-crm]");
  if (cr) {
    readF();
    if (adm.f.k.length > 1) adm.f.k.splice(+cr.dataset.crm, 1);
    return drawA();
  }
  const ip = t.closest("[data-iprm]");
  if (ip) {
    readF();
    adm.f.img.splice(+ip.dataset.iprm, 1);
    return drawA();
  }
  if (B("asave")) {
    readF();
    const f = adm.f,
      p = num(f.p),
      o = num(f.o),
      z = f.z
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      k = f.k.filter((c) => c[0].trim()).map((c) => [c[0].trim(), c[1]]);
    const er = (m) => (d.querySelector("#aer").textContent = m);
    if (!f.n.trim() || !(p > 0) || !z.length || !k.length)
      return er("Preencha nome, preço, tamanhos e ao menos uma cor.");
    if (o > 0 && o <= p)
      return er("O preço antigo precisa ser maior que o preço atual.");
    P.unshift({
      c: nextCode(f.g),
      n: f.n.trim(),
      g: f.g,
      p,
      ...(o > 0 ? { o } : {}),
      z,
      k,
      f: o > 0 ? [...f.f, "out"] : f.f,
      img: f.img,
    });
    adm.v = "list";
    commit();
    toast("Peça cadastrada");
  }
});
$("#ad").addEventListener("change", async (e) => {
  const t = e.target;
  if (t.id === "aph") {
    readF();
    const room = Math.max(0, 6 - adm.f.img.length);
    for (const fl of [...t.files].slice(0, room)) {
      try {
        adm.f.img.push(await shrink(fl));
      } catch (x) {}
    }
    drawA();
  }
  if (t.id === "aimp") {
    const fl = t.files[0];
    if (!fl) return;
    try {
      const j = JSON.parse(await fl.text());
      if (!Array.isArray(j)) throw 0;
      P = j.map(norm);
      cart = cart.filter((i) => P.some((p) => p.c === i.c));
      save();
      count();
      commit();
      toast("Catálogo importado");
    } catch (x) {
      toast("Arquivo inválido");
    }
  }
});
function openA() {
  adm = { v: "list", f: null, arm: null };
  drawA();
  if (!$("#ad").open) $("#ad").showModal();
}
$("#ad").addEventListener("close", () => {
  try {
    if (location.hash.toLowerCase() === "#admin")
      history.replaceState(null, "", location.pathname + location.search);
  } catch (e) {}
});
$("#fad").addEventListener("click", (e) => {
  e.preventDefault();
  openA();
});
addEventListener("hashchange", () => {
  if (location.hash.toLowerCase() === "#admin") openA();
});

(async () => {
  await loadP();
  cart = cart.filter((i) => P.some((p) => p.c === i.c));
  count();
  render();
  $("#fn").hidden = !usingSample;
  const h = (
    new URLSearchParams(location.search).get("p") ||
    decodeURIComponent(location.hash.slice(1))
  ).toUpperCase();
  if (P.some((p) => p.c === h)) openP(h);
  if (location.hash.toLowerCase() === "#admin") openA();
})();
