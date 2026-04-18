export default async function userSignUp(userEmail:string,userPassword:string,userName:string,userTelephone:string) {

    const response = await fetch("https://be-project-68-dinoping-host.vercel.app/api/v1/auth/register", {
        method: "POST",
        headers: {
            "Content-Type" : "application/json"
        },
        body: JSON.stringify({
            email: userEmail,
            password: userPassword,
            telephone: userTelephone,
            name: userName
        })
    })

    if(!response.ok) {
        throw new Error("Failed to register")
    }

    return await response.json()
}