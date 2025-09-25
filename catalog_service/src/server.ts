
import expressApp from './expressApp'


const PORT = process.env.PORT || 8000

export const startServer =async()=>{
    expressApp.listen(PORT,()=>{
      console.log(`listening on port ${PORT}`)
    })

    process.on("uncaughtException",async(err)=>{
        console.log(err);
        process.exit(1);
    })
}

startServer().then(()=>{
    console.log("server is up")
})