import Image from "next/image"
import { Button } from "@mui/material"

export default function NavBar(){
    return(
        <header className="bg-purple-700 flex items-center justify-between px-5">
            <div>
                <Image src={"/icons/kingAcai.png"} alt="" width={75} height={75}></Image>
            </div>
            <div className="flex gap-5">
                <Button className="text-white bg-green-500 hover:bg-green-700">Estoque</Button>
                <Button className="text-white bg-green-500 hover:bg-green-700">Gráficos</Button>
                <Button className="text-white bg-green-500 hover:bg-green-700">Vendas</Button>
            </div>
        </header>
    )
}