<template>
  <div id="app">
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" :width="width" :height="width">
      <circle cx="100" cy="100" :r="100 - border / 2" fill="none" opacity="0.4" :stroke="color"
        :stroke-width="border" />
      <circle cx="100" cy="100" :r="100 - border / 2" fill="none" transform="rotate(270,100,100)" :stroke="color"
        :stroke-width="border" :stroke-dasharray="dashLen" :stroke-dashoffset="dashOffset"
        style="transition: stroke-dashoffset 0.4s" />
      <text x="100" y="130" text-anchor="middle" :font-size="fontSize + 5" :fill="color">
        {{ countDown }}
      </text>
    </svg>
  </div>
</template>
<script>
export default {
  name: 'RingCountdown',
  props: {
    setTimer: {
      type: Number,
      required: true
    },
    start: {
      type: Boolean,
      default: false
    },
    width: {
      type: Number,
      default: 30
    },
    border: {
      type: Number,
      default: 10
    },
    color: {
      type: String,
      default: '#000'
    },
    fontSize: {
      type: Number,
      default: 80
    }
  },
  data() {
    return {
      timeLeft: this.setTimer,
      dashLen: (100 - this.border / 2) * Math.PI * 2
    }
  },
  computed: {
    countDown() {
      let time = this.timeLeft
      if (time <= 0) {
        return 0
      } else {
        return time
      }
    },
    dashOffset() {
      return -(this.dashLen - this.timeLeft / this.setTimer * this.dashLen)
    }
  },
  mounted() {
    this.interval = setInterval(() => {
      this.timeLeft--
      console.log(this.timeLeft)
      if (this.timeLeft <= 0) {
        console.log('倒计时结束，清除倒计时')
        clearInterval(this.interval)
        this.$emit('stopCount')
      }
    }, 1000)
  },
  methods: {
    clear() {
      console.log(this.interval)
      console.log('清除倒计时')
      clearInterval(this.interval)
    }
  }
}

</script>
