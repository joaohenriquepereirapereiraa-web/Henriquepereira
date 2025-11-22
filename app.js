async function loadData() {
  try {
    const res = await fetch('data/modules.json'); // caminho relativo
    if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
    const data = await res.json();
    const modules = Array.isArray(data.modules) ? data.modules : [];
    document.getElementById('message').style.display = 'none';
    return modules.map(m => sanitizeModule(m));
  } catch (err) {
    const msg = document.getElementById('message');
    msg.textContent = 'Erro ao carregar conteúdo: ' + err.message;
    msg.style.color = '#b00020';
    console.error('loadData error', err);
    return [];
  }
}

function sanitizeModule(module) {
  const sanitize = s => {
    if (!s) return s;
    return String(s).replace(/Bogdan Tirziu/gi, 'BN FIT');
  };
  const copy = { ...module };
  copy.title = sanitize(copy.title);
  copy.brand = sanitize(copy.brand);
  copy.description = sanitize(copy.description);
  if (Array.isArray(copy.images)) copy.images = copy.images.map(img => sanitize(img));
  return copy;
}

function createCard(module) {
  const tmpl = document.getElementById('module-card-template');
  const node = tmpl.content.cloneNode(true);
  const img = node.querySelector('.thumb');
  img.src = module.images && module.images[0] ? module.images[0] : 'https://picsum.photos/seed/placeholder/600/400';
  img.alt = module.title || 'BN FIT';
  node.querySelector('.title').textContent = module.title || 'Untitled';
  node.querySelector('.meta').textContent = `${module.brand || 'BN FIT'} • Recenzii: ${module.rating || '—'} (${module.reviewsCount || 0})`;
  node.querySelector('.price').textContent = `${module.priceCurrent ? module.priceCurrent : '—'}`;
  node.querySelector('.view-btn').addEventListener('click', () => showDetail(module));
  return node;
}

function renderList(modules) {
  const list = document.getElementById('modules-list');
  list.innerHTML = '';
  if (!modules || modules.length === 0) {
    const msg = document.getElementById('message');
    msg.textContent = 'Nenhum módulo encontrado.';
    msg.style.display = 'block';
    return;
  }
  modules.forEach(m => {
    const card = createCard(m);
    list.appendChild(card);
  });
}

function showDetail(module) {
  document.getElementById('modules-list').classList.add('hidden');
  const detail = document.getElementById('module-detail');
  detail.classList.remove('hidden');
  const tmpl = document.getElementById('module-detail-template');
  detail.innerHTML = '';
  const node = tmpl.content.cloneNode(true);
  node.getElementById('detail-title').textContent = module.title;
  node.getElementById('detail-meta').textContent = `${module.brand || 'BN FIT'} • SKU: ${module.sku || '—'} • Recenzii: ${module.rating || '—'}`;
  node.getElementById('detail-desc').textContent = module.description || '';
  node.getElementById('detail-price').textContent = `Preț: ${module.priceCurrent || '—'} (în loc de ${module.priceOriginal || '—'})`;
  const gallery = node.getElementById('image-gallery');
  if (module.images && module.images.length) {
    module.images.forEach(src => {
      const i = document.createElement('img');
      i.src = src;
      i.alt = module.title;
      gallery.appendChild(i);
    });
  }
  node.getElementById('back-btn').addEventListener('click', () => {
    detail.classList.add('hidden');
    document.getElementById('modules-list').classList.remove('hidden');
  });
  detail.appendChild(node);
}

(async function init(){
  const modules = await loadData();
  renderList(modules);
})();
