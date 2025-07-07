$(document).ready(function () {
  let hoverTimer;

  // 데스크탑 사이즈 체크 함수
  function isDesktop() {
    return window.innerWidth > 1267;
  }

  // SNB 메뉴용 데스크탑 체크 함수 (768px 기준)
  function isSNBDesktop() {
    return window.innerWidth > 768;
  }

  function updateHeaderLeftWidth() {
    if (!isDesktop()) return; // 데스크탑에서만 실행

    const $siteLogo = $(".site-header__logo");
    if ($siteLogo.length) {
      const logoRight = $siteLogo.offset().left + $siteLogo.width();

      document.documentElement.style.setProperty(
        "--header-left-width",
        logoRight + "px"
      );
    }
  }

  function updateCoverHeight() {
    if (!isDesktop()) return; // 데스크탑에서만 실행

    let maxHeight = 0;

    $(".lnb-list--depth-2").each(function () {
      const $this = $(this);
      const itemHeight = $this.innerHeight();
      if (itemHeight > maxHeight) {
        maxHeight = itemHeight;
      }
    });

    const totalHeight = maxHeight;

    document.documentElement.style.setProperty(
      "--cover-height",
      totalHeight + "px"
    );
  }

  function showHeaderHover() {
    if (!isDesktop()) return; // 데스크탑에서만 실행

    clearTimeout(hoverTimer);
    $("body").addClass("is-header-hover");
    updateCoverHeight();
  }

  function hideHeaderHover() {
    if (!isDesktop()) return; // 데스크탑에서만 실행

    hoverTimer = setTimeout(function () {
      $("body").removeClass("is-header-hover");
    }, 300); // 200ms 지연
  }

  updateHeaderLeftWidth();
  $(window).on("resize", updateHeaderLeftWidth);

  // header 영역 hover (데스크탑에서만)
  if (isDesktop()) {
    $(".site-header").on("mouseover", showHeaderHover);
    $(".site-header").on("mouseout", hideHeaderHover);

    // cover 영역에도 hover 이벤트 (타이머 취소)
    $(".site-header__cover").on("mouseover", showHeaderHover);
    $(".site-header__cover").on("mouseout", hideHeaderHover);
  }

  // resize 이벤트로 데스크탑/모바일 전환 시 이벤트 재설정
  $(window).on("resize", function () {
    if (isDesktop()) {
      // 데스크탑으로 전환 시 모든 기능 활성화
      $(".site-header")
        .off("mouseover mouseout")
        .on("mouseover", showHeaderHover)
        .on("mouseout", hideHeaderHover);
      $(".site-header__cover")
        .off("mouseover mouseout")
        .on("mouseover", showHeaderHover)
        .on("mouseout", hideHeaderHover);

      // intro hover 효과 재활성화
      initIntroHover();

      // side pager 재활성화
      initSidePager();
    } else {
      // 모바일로 전환 시 모든 기능 비활성화
      $(".site-header").off("mouseover mouseout");
      $(".site-header__cover").off("mouseover mouseout");
      $("body").removeClass("is-header-hover");

      // intro hover 효과 제거
      $(".intro__content-inner").off("mouseenter mouseleave");
      $(".intro__content-inner").removeClass("active");
      $(".intro__bg-img").removeClass("active scale");

      // side pager 비활성화 (active 클래스 제거)
      $(".side-pager__item").removeClass("active");
    }

    // SNB 메뉴 재초기화 (768px 기준)
    initSNBMenu();
  });

  // 자동재생 상태 관리
  let isAutoplay = true;
  let mainVisualSwiper; // 변수 선언을 위로 이동

  // 슬라이드 카운터 업데이트 (swiper 초기화 이전에 정의)
  function updateSlideCounter(swiper) {
    const swiperObj = swiper || mainVisualSwiper;
    if (swiperObj) {
      $(".visual__slide-cur-num").text(
        (swiperObj.realIndex + 1).toString().padStart(2, "0")
      );
      $(".visual__slide-total-num").text(
        swiperObj.slides.length.toString().padStart(2, "0")
      );
    }
  }

  // 진행바 업데이트 (swiper 초기화 이전에 정의)
  function updateProgressBar(swiper) {
    const swiperObj = swiper || mainVisualSwiper;
    if (swiperObj) {
      const progress =
        ((swiperObj.realIndex + 1) / swiperObj.slides.length) * 100;
      $(".visual__slide-progress-bar").css("width", progress + "%");
    }
  }

  // 자동재생 상태 관리 (swiper 초기화 이전에 정의)
  function updatePlayButton() {
    if (isAutoplay) {
      $(".visual__slide-btn-toggle").removeClass("paused").addClass("playing");
    } else {
      $(".visual__slide-btn-toggle").removeClass("playing").addClass("paused");
    }
  }

  // Main Visual Swiper
  if (document.getElementById("mainVisualSwiper")) {
    mainVisualSwiper = new Swiper("#mainVisualSwiper", {
      effect: "fade",
      fadeEffect: {
        crossFade: true,
      },
      speed: 1000,
      autoplay: {
        delay: 8000,
        disableOnInteraction: false,
      },
      loop: true,
      on: {
        init: function () {
          // 첫 번째 슬라이드에 scale 클래스 추가
          this.slides[this.activeIndex].classList.add("scale");
          // 초기 카운터 및 진행바 설정 (this 사용)
          updateSlideCounter(this);
          updateProgressBar(this);
          updatePlayButton();
          // visual__content에 active 클래스 추가
          $(".visual__content").addClass("active");
        },
        slideChangeTransitionStart: function () {
          // 슬라이드 시작 시 visual__content에서 active 클래스 제거
          $(".visual__content").removeClass("active");
        },
        slideChangeTransitionEnd: function () {
          // 현재 활성 슬라이드 외 모든 슬라이드에서 scale 클래스 제거
          this.slides.forEach((slide, index) => {
            if (index === this.activeIndex) {
              slide.classList.add("scale");
            } else {
              slide.classList.remove("scale");
            }
          });
          // 카운터 및 진행바 업데이트 (this 사용)
          updateSlideCounter(this);
          updateProgressBar(this);
          // 슬라이드 완료 후 visual__content에 active 클래스 추가
          $(".visual__content").addClass("active");
        },
      },
    });
  }

  // 슬라이드 컨트롤 버튼 이벤트
  $(".visual__slide-btn-prev").on("click", function (e) {
    e.preventDefault();
    if (mainVisualSwiper) mainVisualSwiper.slidePrev();
  });

  $(".visual__slide-btn-next").on("click", function (e) {
    e.preventDefault();
    if (mainVisualSwiper) mainVisualSwiper.slideNext();
  });

  // 재생/정지 토글
  $(".visual__slide-btn-toggle").on("click", function (e) {
    e.preventDefault();
    if (mainVisualSwiper) {
      if (isAutoplay) {
        mainVisualSwiper.autoplay.stop();
        isAutoplay = false;
      } else {
        mainVisualSwiper.autoplay.start();
        isAutoplay = true;
      }
      updatePlayButton();
    }
  });

  // Intro 섹션 hover 효과 (데스크탑에서만)
  let introScaleTimer;

  function initIntroHover() {
    if (!isDesktop()) return; // 데스크탑에서만 실행

    $(".intro__content-inner")
      .on("mouseenter", function () {
        const introItem = $(this).data("intro-item");
        const $targetBg = $(`.intro__bg-img[data-intro-item="${introItem}"]`);

        // 모든 active, scale 클래스 제거
        $(".intro__content-inner").removeClass("active");
        $(".intro__bg-img").removeClass("active scale");

        // 타이머 클리어
        clearTimeout(introScaleTimer);

        // 현재 콘텐츠와 해당 배경에 active 클래스 추가
        $(this).addClass("active");
        $targetBg.addClass("active");

        // 0.3초 후 배경에 scale 클래스 추가
        introScaleTimer = setTimeout(function () {
          $targetBg.addClass("scale");
        }, 400);
      })
      .on("mouseleave", function () {
        // 타이머 클리어
        clearTimeout(introScaleTimer);

        // 모든 클래스 제거
        $(".intro__content-inner").removeClass("active");
        $(".intro__bg-img").removeClass("active scale");
      });
  }

  // 초기 실행
  initIntroHover();

  // Board Swiper
  const boardSwiper = new Swiper("#boardSwiper", {
    slidesPerView: "auto",
    spaceBetween: 0,
    loop: false,
    navigation: {
      nextEl: ".board__slide-next",
      prevEl: ".board__slide-prev",
    },
  });

  // Side Pager 기능 (데스크탑에서만)
  function initSidePager() {
    if (!isDesktop()) return; // 데스크탑에서만 실행

    // 사이드 페이저와 섹션들이 존재하는지 확인
    const $sidePager = $(".side-pager");
    if (!$sidePager.length) return;

    const $sections = $(".visual, .intro, .board");
    if (!$sections.length) return;

    const $pagerItems = $(".side-pager__item");
    if (!$pagerItems.length) return;

    // 섹션 클래스명과 data-section 매핑
    const sectionMapping = {
      visual: "mainVisual",
      intro: "mainIntro",
      board: "mainBoard",
    };

    // IntersectionObserver로 섹션 감지 (이 부분은 jQuery에 직접 대안이 없어서 유지)
    const observerOptions = {
      root: null,
      rootMargin: "-50% 0px -50% 0px", // 화면 중앙에 올 때 감지
      threshold: 0,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionClass = $(entry.target).attr("class").split(" ")[0]; // 첫 번째 클래스명
          const mappedSection = sectionMapping[sectionClass];

          if (mappedSection) {
            // 모든 아이템에서 active 제거
            $pagerItems.removeClass("active");

            // 해당 섹션 아이템에 active 추가
            $(`.side-pager__item[data-section="${mappedSection}"]`).addClass(
              "active"
            );
          }
        }
      });
    }, observerOptions);

    // 모든 섹션 관찰 시작
    $sections.each(function () {
      observer.observe(this);
    });

    // 페이저 클릭 이벤트 (아이템 전체를 클릭 가능하게)
    $pagerItems.on("click", function (e) {
      e.preventDefault();

      const dataSection = $(this).data("section");
      if (!dataSection) return;

      // data-section을 실제 섹션 클래스명으로 변환
      const reversedMapping = {
        mainVisual: "visual",
        mainIntro: "intro",
        mainBoard: "board",
      };

      const targetSectionClass = reversedMapping[dataSection];
      if (targetSectionClass) {
        const $targetElement = $(`.${targetSectionClass}`);
        if ($targetElement.length) {
          $("html, body").animate(
            {
              scrollTop: $targetElement.offset().top,
            },
            800
          );
        }
      }
    });
  }

  // SNB 메뉴 이벤트 처리 함수
  function initSNBMenu() {
    const $snbMenus = $(".snb__menu");

    if (!$snbMenus.length) return; // SNB 메뉴가 없으면 실행하지 않음

    // 기존 document 클릭 이벤트 제거 (중복 방지)
    $(document).off("click.snbMenu");

    if (isSNBDesktop()) {
      // 데스크탑 (768px 초과): mouseover/mouseout
      $snbMenus
        .off("mouseover mouseout click")
        .on("mouseover", function () {
          // 다른 메뉴들 active 제거
          $snbMenus.not(this).removeClass("active");
          // 현재 메뉴 active 추가
          $(this).addClass("active");
        })
        .on("mouseout", function () {
          $(this).removeClass("active");
        });
    } else {
      // 모바일 (768px 이하): click 토글
      $snbMenus.off("mouseover mouseout click").on("click", function (e) {
        e.preventDefault();
        e.stopPropagation(); // 이벤트 버블링 방지

        // 다른 메뉴들 active 제거
        $snbMenus.not(this).removeClass("active");
        // 현재 메뉴 토글
        $(this).toggleClass("active");
      });
    }

    // 영역 밖 클릭 시 메뉴 닫기 (모바일에서는 필수, 데스크탑에서도 유용)
    $(document).on("click.snbMenu", function (e) {
      // SNB 영역 내부 클릭이면 무시
      if ($(e.target).closest(".snb").length > 0) {
        return;
      }

      // 모든 SNB 메뉴 닫기
      $snbMenus.removeClass("active");
    });
  }

  // 초기 실행
  initSNBMenu();

  // DOM 로드 후 side-pager 초기화
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initSidePager);
  } else {
    initSidePager();
  }
});
