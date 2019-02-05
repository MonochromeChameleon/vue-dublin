<template>
  <main @click="nextPage">
    <transition name="fade" mode="out-in">
      <router-view class="main-page" />
    </transition>
  </main>
</template>

<script>
export default {
  created() {
    window.addEventListener('keydown', this.onKeyPress);
  },
  methods: {
    nextPage() {
      const thisRouteIndex = this.$router.options.routes.findIndex(
        r => r.name === this.$route.name
      );
      const thisRoute = this.$router.options.routes[thisRouteIndex];
      if (thisRoute.props) {
        const { section, sections } = thisRoute.props(this.$route);
        const hasNextSection = section < sections - 1;

        if (hasNextSection) {
          return this.$router.push({ name: this.$route.name, params: { section: section + 1 } });
        }
      }

      const nextPage = this.$router.options.routes[thisRouteIndex + 1];

      if (Object.hasOwnProperty.call(nextPage, 'name')) {
        return this.$router.push({ name: nextPage.name });
      }

      return undefined;
    },
    previousPage() {
      const thisRouteIndex = this.$router.options.routes.findIndex(
        r => r.name === this.$route.name
      );

      const thisRoute = this.$router.options.routes[thisRouteIndex];
      if (thisRoute.props) {
        const { section } = thisRoute.props(this.$route);

        if (section > 0) {
          return this.$router.push({ name: this.$route.name });
        }
      }

      if (thisRouteIndex > 0) {
        const previousRoute = this.$router.options.routes[thisRouteIndex - 1];
        return this.$router.push({ name: previousRoute.name });
      }

      return undefined;
    },
    onKeyPress(event) {
      switch (event.keyCode) {
        case 39:
        case 32:
          this.nextPage();
          break;
        case 37:
          this.previousPage();
          break;
        default:
      }
    }
  }
};
</script>

<style lang="scss">
@import '~bootstrap/scss/bootstrap.scss';
@import './style/timeline';

.spacer {
  margin-top: 20vh;
}

.victory {
  font-size: 3rem;
  padding: 20vh;
  text-align: center;
}

.center {
  text-align: center;
}

img {
  max-width: 90vw;
  max-height: 75vh;
}
</style>

<style scoped lang="scss">
main {
  position: fixed;
  height: 100vh;
  width: 100vw;
  overflow-y: scroll;
  overflow-x: hidden;

  background-image: url('./img/chameleon.png');
  background-repeat: no-repeat;
  background-position-y: bottom;
  background-position-x: right;

  background-size: auto 20vh;

  padding: 5vw;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease-in-out;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
