// main.js - نظام إدارة متجر الملابس المحدث
// العناصر الأساسية
let title = document.getElementById("title");
let price = document.getElementById("price");
let discount = document.getElementById("discount");
let total = document.querySelector(".total span");
let count = document.getElementById("count");
let category = document.getElementById("category");
let submit = document.getElementById("create");
let search = document.getElementById("search");
let searchTitle = document.getElementById("searchTitle");
let searchCategory = document.getElementById("searchCategory");
let deleteAll = document.getElementById("delAll");
let tbody = document.querySelector("tbody");
let searchMood = "title";
let mood = "create";
let temp;

// مصفوفة المنتجات
let newArr = [];
// تحميل البيانات من Local Storage إذا كانت موجودة
if (window.localStorage.getItem("products") != null) {
  newArr = JSON.parse(localStorage.getItem("products"));
}

// الأحداث الرئيسية
if (submit) {
  submit.addEventListener("click", function () {
    title.focus();
    createProduct();
    clearInputs();
    saveData();
    getTotal();
    showProducts();
  });
}

// دالة حساب المجموع
function getTotal() {
  if (price && price.value != "") {
    let result = +price.value - +discount.value;
    if (total) total.innerHTML = result;
    if (total && total.parentElement)
      total.parentElement.style.backgroundColor = "green";
  } else {
    if (total) total.innerHTML = "";
    if (total && total.parentElement)
      total.parentElement.style.backgroundColor = "red";
  }
}

// دالة للحصول على المقاسات المحددة
function getSelectedSizes() {
  const sizeCheckboxes = document.querySelectorAll(
    'input[name="size"]:checked'
  );
  return sizeCheckboxes.length > 0
    ? Array.from(sizeCheckboxes)
        .map((cb) => cb.value)
        .join(", ")
    : "";
}

// دالة للحصول على الألوان المحددة
function getSelectedColors() {
  const colorCheckboxes = document.querySelectorAll(
    'input[name="color"]:checked'
  );
  let checkedColor =
    colorCheckboxes.length > 0
      ? Array.from(colorCheckboxes)
          .map((cb) => cb.value)
          .join(", ")
      : "";
  return checkedColor;
}

// دالة إنشاء منتج
function createProduct() {
  if (title.value != "" && price.value != "" && category.value != "" && count.value != "") {
    let product = {
      title: title.value,
      price: price.value,
      discount: discount.value,
      total: total ? total.innerHTML : "",
      count: count.value,
      category: category.value,
      sizes: getSelectedSizes(),
      colors: getSelectedColors(),
      sell: 0,
    };

    // Choose Mood For Create Or Update
    if (mood == "create") {
      let productExists = false;

      // البحث عن منتج مطابق تماماً في كل الخصائص
      for (let i = 0; i < newArr.length; i++) {
        if (
          newArr[i].title === product.title &&
          newArr[i].price === product.price &&
          newArr[i].category === product.category &&
          newArr[i].sizes === product.sizes &&
          newArr[i].colors === product.colors
        ) {
          // إذا وجدنا منتج مطابق تماماً، نزيد الكمية
          newArr[i].count = String(
            Number(newArr[i].count) + Number(product.count)
          );
          productExists = true;
          break; // نخرج من الحلقة بعد العثور على المنتج
        }
      }

      // إذا لم نجد منتج مطابق تماماً، نضيف منتج جديد
      if (!productExists) {
        newArr.push(product);
      }
    }
    // This else that below Mean Mood is update
    else {
      newArr[temp] = product;
      mood = "create";
      if (submit) submit.innerHTML = "Create";
      if (count) count.style.display = "block";
    }

    // حفظ البيانات وعرضها
    saveData();
    showProducts();
    clearInputs();
  } else {
      Swal.fire({
          icon: 'error',
          title: 'خطأ',
          text: 'يرجى إدخال البيانات المطلوبة (الاسم، السعر، القسم، والكمية)',
      });
  }
}
// دالة مسح الحقول
function clearInputs() {
  if (title) title.value = "";
  if (price) price.value = "";
  if (discount) discount.value = "";
  if (count) count.value = "";
  if (category) category.value = "";

  // مسح خيارات المقاسات والألوان
  document
    .querySelectorAll('input[name="size"]:checked')
    .forEach((cb) => (cb.checked = false));
  document
    .querySelectorAll('input[name="color"]:checked')
    .forEach((cb) => (cb.checked = false));

  // إعادة تعيين الحالة إلى إنشاء
  mood = "create";
  if (submit) submit.innerHTML = "Create";
  if (count) count.style.display = "block";
}

// دالة حفظ البيانات في Local Storage
function saveData() {
  window.localStorage.setItem("products", JSON.stringify(newArr));
}

// دالة عرض المنتجات
function showProducts() {
  if (!tbody) return;

  tbody.innerHTML = "";
  for (let i = 0; i < newArr.length; i++) {
    // Create Row For Tbody
    let tr = document.createElement("tr");
    tbody.append(tr);

    // Add ID column
    let tdId = document.createElement("td");
    tdId.innerHTML = i + 1;
    tr.appendChild(tdId);

    // Add product data columns
    let product = newArr[i];
    let tdTitle = document.createElement("td");
    tdTitle.innerHTML = product.title;
    tr.appendChild(tdTitle);

    let tdPrice = document.createElement("td");
    tdPrice.innerHTML = product.price;
    tr.appendChild(tdPrice);

    let tdDiscount = document.createElement("td");
    tdDiscount.innerHTML = product.discount;
    tr.appendChild(tdDiscount);

    let tdTotal = document.createElement("td");
    tdTotal.innerHTML = product.total;
    tr.appendChild(tdTotal);

    let tdCategory = document.createElement("td");
    tdCategory.innerHTML = product.category;
    tr.appendChild(tdCategory);

    let tdSizes = document.createElement("td");
    tdSizes.innerHTML = product.sizes || "";
    tr.appendChild(tdSizes);

    let tdColors = document.createElement("td");
    tdColors.innerHTML = product.colors || "";
    tr.appendChild(tdColors);

    let tdCount = document.createElement("td");
    tdCount.innerHTML = product.count;
    tr.appendChild(tdCount);

    // Create Update Button
    let update = document.createElement("td");
    let updateBtn = document.createElement("button");
    updateBtn.innerHTML = "Update";
    update.append(updateBtn);
    tr.append(update);
    update.addEventListener("click", function () {
      updateProduct(i);
    });

    // Create Delete Button
    let del = document.createElement("td");
    let delBtn = document.createElement("button");
    delBtn.innerHTML = "Delete";
    delBtn.classList.add("delete");
    del.append(delBtn);
    tr.append(del);
    del.addEventListener("click", function () {
      deleteOneProduct(i);
    });

    // Create Button Sell
    let tdSell = document.createElement("td");
    let sellBtn = document.createElement("button");
    sellBtn.classList.add("sell");
    tdSell.appendChild(sellBtn);
    sellBtn.innerHTML = product.sell;
    tr.appendChild(tdSell);

    tdSell.addEventListener("click", function () {
      addToSell(i);
      // bestSeller(i);
    });
  }

  // Button For Delete All Products
  if (deleteAll) {
    if (newArr.length > 0) {
      deleteAll.innerHTML = "";
      let btnDelete = document.createElement("button");
      btnDelete.innerHTML = "Delete All";
      deleteAll.appendChild(btnDelete);
      btnDelete.addEventListener("click", function () {
        deleteAllProducts();
      });
    } else {
      deleteAll.innerHTML = "";
    }
  }

  // تحديث الإحصائيات
  updateStats();
  showTopProducts();
  showTopProductsChart(); 
  showCategoryChart();
}

// دالة تحديث الإحصائيات
function updateStats() {
  let arrCount = [];
  let countOfSell = [];
  let menCount = 0;
  let womenCount = 0;
  let kidsCount = 0;
  for (let i = 0; i < newArr.length; i++) {
    // This If That Below Calulate The Number of Product Sold
    if (newArr[i].sell) {
      countOfSell.push(newArr[i].sell);
    }

    arrCount.push(+newArr[i].count);

    if (newArr[i].category === "رجالي") {
      menCount += +newArr[i].count;
    }
    if (newArr[i].category === "حريمي") {
      womenCount += +newArr[i].count;
    }
    if (newArr[i].category === "أطفال") {
      kidsCount += +newArr[i].count;
    }
  }

  let sumOfProduct = arrCount.reduce(function (acc, current) {
    return acc + current;
  }, 0);

  let sumOfSell = countOfSell.reduce(function (acc, current) {
    return acc + current;
  }, 0);

  // حساب عدد المنتجات في كل قسم

  // تحديث الإحصائيات في واجهة المستخدم إذا كانت العناصر موجودة
  const statCards = document.querySelectorAll(".stat-card h3");
  // للحصول على عدد النتجات
  if (statCards.length >= 3) {
    statCards[0].innerText = sumOfProduct;
    statCards[2].innerText = "3"; // عدد الأقسام ثابت
    statCards[3].innerText = sumOfSell;
  }

  // تحديث إحصائيات الأقسام
  const categoryCards = document.querySelectorAll(".category-card");
  if (categoryCards.length >= 3) {
    categoryCards[0].querySelector(
      ".category-stats p:first-child"
    ).innerText = `عدد المنتجات: ${menCount}`;
    categoryCards[1].querySelector(
      ".category-stats p:first-child"
    ).innerText = `عدد المنتجات: ${womenCount}`;
    categoryCards[2].querySelector(
      ".category-stats p:first-child"
    ).innerText = `عدد المنتجات: ${kidsCount}`;
  }
}

// دالة حذف منتج واحد
function deleteOneProduct(i) {
  Swal.fire({
    title: "هل تريد حذف هذا المنتج؟",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "نعم",
    cancelButtonText: "إلغاء",
  }).then((result) => {
    if (result.isConfirmed) {
      newArr.splice(i, 1);
      localStorage.setItem("products", JSON.stringify(newArr));
      showProducts();
      showTopProducts();
      Swal.fire("تم الحذف!", "", "success");
    }
  });
}

// دالة حذف جميع المنتجات
function deleteAllProducts() {
  Swal.fire({
    title: "هل تريد حذف كل المنتجات؟",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "نعم",
    cancelButtonText: "إلغاء",
  }).then((result) => {
    if (result.isConfirmed) {
      newArr.splice(0);
      localStorage.setItem("products", JSON.stringify(newArr));
      showProducts();
      showTopProducts();
      Swal.fire("تم حذف كل المنتجات!", "", "success");
    }
  });
}

// دالة التعديل على منتج
function updateProduct(i) {
  if (title) title.value = newArr[i].title;
  if (price) price.value = newArr[i].price;
  if (discount) discount.value = newArr[i].discount;
  if (category) category.value = newArr[i].category;
  if (count) count.value = newArr[i].count;

  // تحديد المقاسات
  if (newArr[i].sizes) {
    const sizes = newArr[i].sizes.split(",").map((s) => s.trim());
    document.querySelectorAll('input[name="size"]').forEach((cb) => {
      cb.checked = sizes.includes(cb.value);
    });
  }

  // تحديد الألوان
  if (newArr[i].colors) {
    const colors = newArr[i].colors.split(",").map((c) => c.trim());
    document.querySelectorAll('input[name="color"]').forEach((cb) => {
      cb.checked = colors.includes(cb.value);
    });
  }

  getTotal();
  if (submit) submit.innerHTML = "Update";
  if (count) count.style.display = "none";
  mood = "update";
  temp = i;

  // التمرير إلى الأعلى
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

// دوال البحث
function getSearchData(id) {
  if (id == "searchTitle") {
    searchMood = "title";
  } else {
    searchMood = "category";
  }

  if (search) search.placeholder = `Search by ${searchMood}`;
  if (search) search.focus();
}

function mainSearchData(value) {
  if (!tbody) return;

  tbody.innerHTML = "";
  for (let i = 0; i < newArr.length; i++) {
    if (searchMood == "title") {
      if (newArr[i].title.toLowerCase().includes(value.toLowerCase())) {
        createTableRow(i);
      }
    } else {
      if (newArr[i].category.toLowerCase().includes(value.toLowerCase())) {
        createTableRow(i);
      }
    }
  }
}

// دالة إنشاء صف في الجدول
function createTableRow(i) {
  let tr = document.createElement("tr");
  if (tbody) tbody.append(tr);

  // Add ID column
  let tdId = document.createElement("td");
  tdId.innerHTML = i + 1;
  tr.appendChild(tdId);

  // Add product data columns
  let product = newArr[i];
  let tdTitle = document.createElement("td");
  tdTitle.innerHTML = product.title;
  tr.appendChild(tdTitle);

  let tdPrice = document.createElement("td");
  tdPrice.innerHTML = product.price;
  tr.appendChild(tdPrice);

  let tdDiscount = document.createElement("td");
  tdDiscount.innerHTML = product.discount;
  tr.appendChild(tdDiscount);

  let tdTotal = document.createElement("td");
  tdTotal.innerHTML = product.total;
  tr.appendChild(tdTotal);

  let tdCategory = document.createElement("td");
  tdCategory.innerHTML = product.category;
  tr.appendChild(tdCategory);

  let tdSizes = document.createElement("td");
  tdSizes.innerHTML = product.sizes || "";
  tr.appendChild(tdSizes);

  let tdColors = document.createElement("td");
  tdColors.innerHTML = product.colors || "";
  tr.appendChild(tdColors);

  let tdCount = document.createElement("td");
  tdCount.innerHTML = product.count;
  tr.appendChild(tdCount);

  // Create Update Button
  let update = document.createElement("td");
  let updateBtn = document.createElement("button");
  updateBtn.innerHTML = "Update";
  update.append(updateBtn);
  tr.append(update);
  update.addEventListener("click", function () {
    updateProduct(i);
  });

  // Create Delete Button
  let del = document.createElement("td");
  let delBtn = document.createElement("button");
  delBtn.innerHTML = "Delete";
  delBtn.classList.add("delete");
  del.append(delBtn);
  tr.append(del);
  del.addEventListener("click", function () {
    deleteOneProduct(i);
  });

  // Create Button Sell
  let tdSell = document.createElement("td");
  let sellBtn = document.createElement("button");
  sellBtn.classList.add("sell");
  tdSell.appendChild(sellBtn);
  sellBtn.innerHTML = product.sell;
  tr.appendChild(tdSell);
  tdSell.addEventListener("click", function () {
    addToSell(i);
  });
}

// أحداث البحث
if (searchTitle) {
  searchTitle.addEventListener("click", function () {
    getSearchData(this.id);
  });
}

if (searchCategory) {
  searchCategory.addEventListener("click", function () {
    getSearchData(this.id);
  });
}

// أحداث القائمة الجانبية
document.querySelectorAll(".menu li").forEach((item) => {
  item.addEventListener("click", function () {
    // إزالة النشاط من جميع العناصر
    document
      .querySelectorAll(".menu li")
      .forEach((li) => li.classList.remove("active"));
    // إضافة النشاط للعنصر الحالي
    this.classList.add("active");

    // إخفاء جميع أقسام المحتوى
    document
      .querySelectorAll(".content-section")
      .forEach((section) => section.classList.remove("active"));

    // إظهار القسم المحدد
    const sectionId = this.getAttribute("data-section") + "-section";
    const sectionElement = document.getElementById(sectionId);
    if (sectionElement) {
      sectionElement.classList.add("active");

      // إذا كان قسم المنتجات، قم بعرض المنتجات
      if (sectionId === "products-section") {
        showProducts();
      }
    }
  });
});

// تفعيل أحداث الحقول لحساب المجموع
if (price) price.addEventListener("keyup", getTotal);
if (discount) discount.addEventListener("keyup", getTotal);

// تفعيل حدث البحث أثناء الكتابة
if (search)
  search.addEventListener("keyup", function () {
    mainSearchData(this.value);
  });

// تهيئة أولية
document.addEventListener("DOMContentLoaded", function () {
  getTotal();
  showProducts();

  // التأكد من أن قسم المنتجات معروض عند التحميل إذا كان موجوداً
  const productsSection = document.getElementById("products-section");
  if (productsSection && productsSection.classList.contains("active")) {
    showProducts();
  }
});

function addToSell(i) {
  const product = newArr[i];
  if (!product) return;

  // لو مفيش مخزون نعرض رسالة ونرجع
  if (+product.count <= 0) {
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "info",
      title: "لا توجد أي منتجات",
      showConfirmButton: false,
      timer: 1500,
      timerProgressBar: true,
    });
    return;
  }

  // ننقص العدد ونزيد عداد البيع
  product.count = String(+product.count - 1);
  product.sell = (+product.sell || 0) + 1;

  saveData();
  showProducts();


  // تنبيه نجاح بيع (Toast)
  Swal.fire({
    toast: true,
    position: "top-end",
    icon: "success",
    title: "تم بيع المنتج بنجاح",
    showConfirmButton: false,
    timer: 1200,
  });
}






// المنتجات الاكثر مبيعا
function showTopProducts() {
  const container = document.getElementById('top-products');
  container.innerHTML = ''; // مسح القديم

  // ترتيب المنتجات حسب عدد المبيعات (sell)
  const topProducts = [...newArr]
    .sort((a, b) => (b.sell || 0) - (a.sell || 0))
    .slice(0, 5); // أول 5 منتجات

  if (topProducts.length === 0 || (topProducts[0].sell || 0) === 0) {
    container.innerHTML = '<p>لا يوجد منتجات مباعة حتى الآن</p>';
    return;
  }

  // إنشاء عناصر للمنتجات
  topProducts.forEach(product => {
    const item = document.createElement('div');
    item.classList.add('top-product-item');
    item.innerHTML = `
      ${product.sell || 0} <strong>${product.title}</strong>
    `;
    container.appendChild(item);
  });
}




let topProductsChart; // عشان 

function showTopProductsChart(){
  const ctx = document.getElementById('topProductsChart').getContext('2d');

  // ترتيب المنتجات حسب عدد المبيعات (sell)
  const topProducts = [...newArr]
    .sort((a, b) => (b.sell || 0) - (a.sell || 0))
    .slice(0, 5); // أول 5 منتجات

  const labels = topProducts.map(p => p.title);
  const data = topProducts.map(p => p.sell || 0);

  // لو فيه رسم قديم نمسحه
  if (topProductsChart) {
    topProductsChart.destroy();
  }

  // رسم جديد
  topProductsChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'عدد المبيعات',
        data: data,
        backgroundColor: '#4CAF50'
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: false
        },
        title: {
          display: true,
          text: 'أكثر المنتجات مبيعًا'
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1
          }
        }
      }
    }
  });
}



let categoryChart;

function showCategoryChart() {
    const ctx = document.getElementById('categoryChart').getContext('2d');
    
    // تجميع البيانات
    let categories = {};
    newArr.forEach(p => {
        if(categories[p.category]) {
            categories[p.category] += (+p.sell || 0); // أو نستخدم p.count لو عايزين المخزون
        } else {
            categories[p.category] = (+p.sell || 0);
        }
    });

    const labels = Object.keys(categories);
    const data = Object.values(categories);

    if (categoryChart) {
        categoryChart.destroy();
    }

    categoryChart = new Chart(ctx, {
        type: 'doughnut', // أو pie
        data: {
            labels: labels,
            datasets: [{
                label: 'المبيعات حسب القسم',
                data: data,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.8)',
                    'rgba(54, 162, 235, 0.8)',
                    'rgba(255, 206, 86, 0.8)',
                    'rgba(75, 192, 192, 0.8)',
                    'rgba(153, 102, 255, 0.8)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                },
                title: {
                    display: true,
                    text: 'توزيع المبيعات على الأقسام'
                }
            }
        }
    });
}

// Initial call
showTopProductsChart();
showCategoryChart();


// --- Today's Orders Feature ---

// Elements
const ordersCard = document.getElementById('orders-card');
const ordersModal = document.getElementById('orders-modal');
const closeModalBtn = document.getElementById('close-modal');
const addOrderBtn = document.getElementById('add-order-btn');
const orderInput = document.getElementById('order-input');
const ordersList = document.getElementById('orders-list');
const ordersCountDisplay = ordersCard.querySelector('h3');

let todayOrders = [];

// Load from Local Storage
if (localStorage.getItem('todayOrders')) {
    todayOrders = JSON.parse(localStorage.getItem('todayOrders'));
    updateOrdersCount();
}

// Show Modal
ordersCard.addEventListener('click', () => {
    ordersModal.classList.add('active');
    renderOrders();
});

// Close Modal
closeModalBtn.addEventListener('click', () => {
    ordersModal.classList.remove('active');
});

// Close on Overlay Click
ordersModal.addEventListener('click', (e) => {
    if (e.target === ordersModal) {
        ordersModal.classList.remove('active');
    }
});

// Add Order
addOrderBtn.addEventListener('click', addOrder);

// Add Order on Enter Key
orderInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addOrder();
    }
});

function addOrder() {
    if (orderInput.value.trim() !== "") {
        const orderText = orderInput.value.trim();
        const order = {
            id: Date.now(),
            text: orderText,
            time: new Date().toLocaleTimeString()
        };
        
        todayOrders.unshift(order); // Add to beginning
        saveOrders();
        renderOrders();
        orderInput.value = "";
        orderInput.focus();
    }
}

function deleteOrder(id) {
    todayOrders = todayOrders.filter(order => order.id !== id);
    saveOrders();
    renderOrders();
}

function saveOrders() {
    localStorage.setItem('todayOrders', JSON.stringify(todayOrders));
    updateOrdersCount();
}

function updateOrdersCount() {
    if (ordersCountDisplay) {
        ordersCountDisplay.innerText = todayOrders.length;
    }
}

function renderOrders() {
    ordersList.innerHTML = "";
    todayOrders.forEach(order => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${order.text} <small style="color:#888; margin-right:5px; font-size:12px">(${order.time})</small></span>
            <button onclick="deleteOrder(${order.id})"><i class="fas fa-trash"></i></button>
        `;
        ordersList.appendChild(li);
    });
}

// --- Daily Notes Feature ---
const dailyNotesInput = document.getElementById('daily-notes');

// Load Notes
if (localStorage.getItem('dailyNotes')) {
    if(dailyNotesInput) dailyNotesInput.value = localStorage.getItem('dailyNotes');
}

// Save Notes (Autosave)
if (dailyNotesInput) {
    dailyNotesInput.addEventListener('input', () => {
        localStorage.setItem('dailyNotes', dailyNotesInput.value);
    });
}




























