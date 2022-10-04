declare let cm: {
  sendOk(text: string): void
  sendNext(text: string): void
  sendPrev(text: string): void
  sendNextPrev(text: string): void
  sendYesNo(text: string): void
  sendAcceptDecline(text: string): void
  sendSimple(text: string): void
  sendGetNumber(text: string, valueDefault: string, min: number, max: number): void
  dispose(): void
  warp(idMap: string, portal: number): void
  getJobId(): number
  getMeso(): number
  gainMeso(mesos: number): number
}
