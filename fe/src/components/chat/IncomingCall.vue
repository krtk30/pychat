<template>
  <div class="incomingCall">
    <div>
      <table class="table">
        <tbody>
        <tr>
          <th>From:</th>
          <td>{{caller}}</td>
        </tr>
        <tr>
          <th>Room:</th>
          <td>{{room}}</td>
        </tr>
        </tbody>
      </table>
      <div class="answerButtons">
        <button class="green-btn" @click="answer"><i class="icon-call-aswer"></i>
          <div>Answer</div>
        </button>
        <button class="green-btn" @click="videoAnswer"><i class="icon-videocam"></i>
          <div>With video</div>
        </button>
        <button class="red-btn" @click="hangUp"><i class="icon-hang-up"></i>
          <div>Decline</div>
        </button>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
  import {State, Action, Mutation, Getter} from "vuex-class";
  import {Component, Prop, Vue} from "vue-property-decorator";
  import {IncomingCallModel, RoomDictModel, UserModel} from "../../types/model";
  import {webrtcApi} from '../../utils/singletons';

  @Component
  export default class IncomingCall extends Vue {

    @Prop() call: IncomingCallModel;
    @State allUsersDict : {[id: number]: UserModel};
    @State roomsDict : RoomDictModel;

    get caller() {
      return this.allUsersDict[this.call.userId].user;
    }

    get room() {
      return this.roomsDict[this.call.roomId].name;
    }

    answer() {
      webrtcApi.answerCall(this.call.connId);
    }

    hangUp() {
      webrtcApi.declineCall(this.call.connId);
    }

    videoAnswer() {
      webrtcApi.videoAnswerCall(this.call.connId);
    }

  }
</script>

<style lang="sass" scoped>
  .incomingCall
    z-index: 1
    position: absolute
    top: 0
    display: flex
    left: 0
    right: 0
    bottom: 0
    background-color: rgba(0, 0, 0, 0.3)
    align-items: center
    justify-content: center
    > div
      background-color: #000000
      padding: 15px
      border-radius: 5px
      border: 1px solid green

  button
    div
      display: inline-block

  table
    width: 100%
    th
      color: #79aeb6
      width: 80px
      text-align: left
      font-weight: bold
    td
      text-overflow: ellipsis
      max-width: 250px
      overflow: hidden
</style>