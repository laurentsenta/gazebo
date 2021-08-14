export function writeToFile(data: any, file: File): Promise<void> {
  return new Promise((resolve) => {
    // const stream = file.createWriteStream({ resumable: false })
    // stream.on('complete', () => {
    //     resolve()
    // })
    // stream.end(data)
  });
}
