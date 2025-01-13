import { toast } from "@/hooks/use-toast";
import { pb } from "@/lib/pb";
import { useRouter } from "next/router";

interface CardPorps {
    data: any[any];
}

const CardService = ({ data }: CardPorps) => {
    console.log(data);

    const router = useRouter();


    const handleDelete = async () => {
        try {
            await pb.collection('Services').delete(data.id);
            toast({
                  title: "🗑️ Deleted",
                  description: "Selected service has been deleted.",
                  variant: "destructive"
                })

            router.reload();
        } catch (error) {
            console.error(error);
        }
    }
    return (

        <div className="flex overflow-hidden bg-white rounded-lg shadow-lg mb-4">

            <div className="w-2/3 p-4">
                <h1 className="text-xl font-bold text-gray-900">
                    {data.service_name}
                </h1>
                <p className="mt-2 text-sm text-gray-600">
                    {data.description}
                </p>

                <div className=" justify-left mt-3 item-center">
                    <h1 className="text-xl font-bold text-gray-700">
                        Price: RM {data.price}
                    </h1>
                    <h1 className="text-lg  text-gray-700">
                         Duration: {data.time_taken} hours
                    </h1>
                    <div className=" flex justify-left mt-2">
                        <button onClick={() => router.push("/editservice/" + data.id)} className="px-3 mr-1 py-2 text-xs font-bold text-white uppercase bg-gray-800 rounded">
                            Edit
                        </button>

                        <button onClick={handleDelete} className="px-3 py-2 text-xs font-bold text-white uppercase bg-red-800 rounded ml-2">
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CardService;