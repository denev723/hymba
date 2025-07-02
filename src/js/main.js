$(document).ready(function () {
  let hoverTimer;

  function updateHeaderLeftWidth() {
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
    clearTimeout(hoverTimer);
    $("body").addClass("is-header-hover");
    updateCoverHeight();
  }

  function hideHeaderHover() {
    hoverTimer = setTimeout(function () {
      $("body").removeClass("is-header-hover");
    }, 300); // 200ms 지연
  }

  updateHeaderLeftWidth();
  $(window).on("resize", updateHeaderLeftWidth);

  // header 영역 hover
  $(".site-header").on("mouseover", showHeaderHover);
  $(".site-header").on("mouseout", hideHeaderHover);

  // cover 영역에도 hover 이벤트 (타이머 취소)
  $(".site-header__cover").on("mouseover", showHeaderHover);
  $(".site-header__cover").on("mouseout", hideHeaderHover);
});
