let kiyafetList = [];
let sepetList = [];


toastr.options = {
    closeButton: false,
    debug: false,
    newestOnTop: false,
    progressBar: false,
    positionClass: "toast-bottom-right",
    preventDuplicates: false,
    onclick: null,
    showDuration: "300",
    hideDuration: "1000",
    timeOut: "5000",
    extendedTimeOut: "1000",
    showEasing: "swing",
    hideEasing: "linear",
    showMethod: "fadeIn",
    hideMethod: "fadeOut",
  };

const ToggleModel = () => {
    const KiyafetModel = document.querySelector(".sepet_kolonu");
    KiyafetModel.classList.toggle("active");
    
};

const getKiyafet = () => {
    fetch("./products.json")
    .then((res) => res.json())
    .then((kiyafet) => (kiyafetList = kiyafet));
    

};

getKiyafet();


const createKiyafetStars = (starRate) => {
    let starRateHtml = "";
    for(let i = 1; i <= 5; i++) {
      if (Math.round(starRate) >= i)
        starRateHtml += `<i class="bi bi-star-fill"></i>`;
      else starRateHtml += `<i class="bi bi-star"></i>`;
    }
  
    return starRateHtml;


};




const CreateKiyafetİtemsHTML = () => {
    const KiyafetListElement = document.querySelector(".kiyafet_list");
    let kiyafetListHtml = "";
    kiyafetList.forEach((kiyafet, index) => { /*    dinamik hale getirme    */
        kiyafetListHtml += `<div class="col-5 ${index % 2 == 0 && "offset-2"} my-5">
          <div class="row kiyafet_card">
            <div class="col-6">
              <img 
              class="img-fluid shadow" 
              src="${kiyafet.imgSource}" 
              width="258"
              height="400"
              />
            </div>
            <div class="col-6 d-flex flex-column ">
              <div class="kiyafet_detay">
                <span class="Baslik">${kiyafet.name}</span><br/>
                <span class="Beden">Beden:${kiyafet.size}</span><br/>
                <span class="kiyafet_stars_rate">
                  ${createKiyafetStars(kiyafet.starRate)}
                  <span>${kiyafet.reviewCount} yorum</span>
                </span>
              </div>
              <div>
                <br/> <br/>
                  <span class="black fw-bold fs-4 me-2">${kiyafet.price}₺</span>
                  ${kiyafet.oldPrice ? `<span class="gray text-decoration-line-through">${kiyafet.oldPrice}₺</span>`
                  : "" }
                
                  </div> 

            <button class="btn_sepete_ekle " onclick="SepeteEkleme(${kiyafet.id})">Sepete Ekle</button>
            </div>
          </div>
        </div>`;

    });

    KiyafetListElement.innerHTML = kiyafetListHtml;
  
};

const Kiyafet_TYPES = {
    AnaSayfa: "Anasayfa",
    ELBİSE: "Elbise",
    DIŞGİYİM: "Dış Giyim",
    TAKIM: "Takım ",
    ALTGİYİM: "Alt Giyim",
    ÜSTGİYİM: "Üst Giyim",
    AYAKKABİ: "Takım ",
    
  };

  const createKiyafetTypesHtml = () => {
    const filterEl = document.querySelector(".filter");
    let filterHtml = "";
    let filterTypes = ["Anasayfa"];
    kiyafetList.forEach((kiyafet) => {
      if (filterTypes.findIndex((filter) => filter == kiyafet.type) == -1)
        filterTypes.push(kiyafet.type);
    });
  
    filterTypes.forEach((type, index) => {
      filterHtml += `<li class="
      ${index == 0 ? "active" : null}" onclick="filterKiyafet(this)" data-type="${type}"${type}">${
        Kiyafet_TYPES[type] || type
      }</li>`;
    });
  
    filterEl.innerHTML = filterHtml;
  };


  const filterKiyafet = (filterEl) => {
    document.querySelector(".filter .active").classList.remove("active");
    filterEl.classList.add("active"); 
    let kiyafetType = filterEl.dataset.type;
    getKiyafet();
    if (kiyafetType != "Anasayfa")
      kiyafetList = kiyafetList.filter((kiyafet) => kiyafet.type == kiyafetType);
    CreateKiyafetİtemsHTML();
  };


  const listBasketItems = () => {
    localStorage.setItem("sepetList", JSON.stringify(sepetList));
    const basketListEl = document.querySelector(".sepet_list");
    const basketCountEl = document.querySelector(".sepet_sayisi");
    basketCountEl.innerHTML = sepetList.length > 0 ? sepetList.length: null;
    const totalPriceEl = document.querySelector(".toplam_fiyat");
  
    let basketListHtml = "";
    let totalPrice = 0;
    sepetList.forEach((item) => {
      totalPrice += item.product.price * item.quantity;
      basketListHtml += `<li class="sepet_item">
            <img 
            src="${item.product.imgSource}" 
            width="100" 
            height="100" 
            />
            <div class="sepet_item_info">
              <h3 class="Baslik">${item.product.name}</h3>
              <span class="Beden">${item.product.size}</span><br/>
              <span class="Fiyat">${item.product.price}₺</span><br/>
              <span class="sil" onclick="removeItemToBasket(${item.product.id})">sil</span>
            </div>
            <div class="kiyafet_sayisi">
              <span class="azaltma" onclick="decreaseItemToBasket(${item.product.id})">-</span>
              <span class="my-5">${item.quantity}</span>
              <span class="arttırma" onclick="increaseItemToBasket(${item.product.id})">+</span>
            </div>
          </li>`;
          
    });
  
    basketListEl.innerHTML = basketListHtml
      ? basketListHtml
      : `<li class="sepet_item">Alışveriş sepetinize henüz ürün eklemediniz. Alışverişe kaldığınız yerden devam edebilir ya da bütün ürünlerimize göz atabilirsiniz.
            </li>`;
    totalPriceEl.innerHTML = totalPrice > 0 ? "Toplam : " + totalPrice.toFixed(2) + "₺" : null; /*fiyatı en fazla 2 rakam yazması ıçın */
  };
  



const SepeteEkleme = (kiyafetid) =>{
    let findedKiyafet = kiyafetList.find((kiyafet) => kiyafet.id == kiyafetid);
    if (findedKiyafet) {
    const basketAlreadyIndex = sepetList.findIndex(
      (sepet) => sepet.product.id == kiyafetid
    );
    if (basketAlreadyIndex == -1) {
      let addedItem = { quantity: 1, product: findedKiyafet };
      sepetList.push(addedItem);
    } else {
      if (
        sepetList[basketAlreadyIndex].quantity <
        sepetList[basketAlreadyIndex].product.stock
      )
        sepetList[basketAlreadyIndex].quantity += 1;
      else {
        toastr.error("Ürün Tükendi.");
        return;
      }
    }
    listBasketItems();
    toastr.success("Ürün Sepete Eklendi.");
    
  }
};



  const removeItemToBasket = (kiyafetid) => {
    const findedIndex = sepetList.findIndex(
      (sepet) => sepet.product.id == kiyafetid
    );
    if (findedIndex != -1) {
      sepetList.splice(findedIndex, 1);
    }
    listBasketItems();

  };
  
  const decreaseItemToBasket = (kiyafetid) => {
    const findedIndex = sepetList.findIndex(
      (sepet) => sepet.product.id == kiyafetid
    );
    if (findedIndex != -1) {
      if (sepetList[findedIndex].quantity != 1)
        sepetList[findedIndex].quantity -= 1;
      else removeItemToBasket(kiyafetid);
      listBasketItems();
    }
  };
  
  const increaseItemToBasket = (kiyafetid) => {
    const findedIndex = sepetList.findIndex(
      (sepet) => sepet.product.id == kiyafetid
    );
    if (findedIndex != -1) {
      if (
        sepetList[findedIndex].quantity < sepetList[findedIndex].product.stock
      )
        sepetList[findedIndex].quantity += 1;
      else toastr.error("Ürün Tükendi.");
      listBasketItems();
    }
  };
  
  if (localStorage.getItem("sepetList")) {
    sepetList = JSON.parse(localStorage.getItem("sepetList"));
    listBasketItems();
  }




 setTimeout(() => {
    CreateKiyafetİtemsHTML();
    createKiyafetTypesHtml();
  }, 100);




/*    ``    */

/*   sorun kiyafet_list gorunmuyor */