import { redirect } from "next/navigation";
import Head from "next/head";
import Link from "next/link";

export const metadata = {
  title: "Whisker Docs",
  description: "The complete treatment for your pet's health",
};

export default function Home() {
  return (
    <>
      <Head></Head>
      <main className={"m-8"}>
        <nav className="mb-16 container mx-auto flex items-center justify-between text-blue-gray-900 ">
        <img
            src={"/assets/logo.png"}
            alt={"Mimiplan Logo"}
            width={150}
            // height={20}
          />
          <div className={"font-bold text-primary text-xl"}>
            <Link href={"/login"}>Login / Sign-up</Link>
          </div>
        </nav>

        <div className={"flex justify-between items-center h-[60vh] ml-10"} style={{ backgroundImage: 'url("/assets/vetster-dog-bed.webp")', backgroundSize: 'cover', backgroundPosition: 'center' }}>
          <div className={"flex flex-col gap-5 flex-1"}>
            <div style={{ paddingLeft: '40px'}}>
              <h1 className={"text-2xl font-bold text-white"}>
                On-demand Offline and Online vet appointments.
                
              </h1>
            </div>
            <div className={"w-4/5"} style={{ color: 'white', paddingLeft: '40px' }}>
              WhiskerDoc connects pet owners to licenced veterinarians  <br />
              ready to provide the best online vet services for your pet <br />
              offline or online, whichever you prefer. 
            </div>
        
            {/* <Link href={"/products"}>
              <button
                className={
                  "bg-primary text-white px-5 py-3 rounded text-lg font-bold hover:bg-secondary transition-all"
                }
              >
                Get started
              </button>
            </Link> */}
          </div>
        </div>

        <div className={"flex justify-center items-center h-[25vh] ml-10"} >
          <div className={"flex flex-col gap-5 flex-1"}>
            <div  style={{ textAlign: 'center' }}>
              <h3 className={"text-2xl font-bold"} style={{ color: 'violet' }}>
               Book with confidence.
             </h3>
            </div>
            <div style={{ color: 'black', textAlign: 'center'}}>
              Licensed veterinarians are ready to help you  <br />
              manage your pet's health. 
            </div>
          </div>
        </div>
        <div className={"mb-16 flex justify-center items-center h-10vh] ml-10"} style={{ textAlign: 'center' }}>
          <div className="flex flex-col items-center">
            <img src="/assets/offline_visit.png" alt="Image 1" className="mb-2" style={{ height: '100px' }}/>
            <h3 className={"text-2xl font-bold"} style={{ color: 'black' }}>
              Physical Visit
            </h3>
            <div className="mt-2" style={{ color: 'black' }}>
            Visit a vet near you, <br />
            when your pet buddy requires a physical checkup.
            </div>
          </div>
          <div className="ml-4 flex flex-col items-center">
            <img src="/assets/online_visit.svg" alt="Image 2" className="mb-2" style={{ height: '100px' }}/>
            <h3 className={"text-2xl font-bold"} style={{ color: 'black' }}>
              Online Consultation
            </h3>
            <div className="mt-2" style={{ color: 'black' }}>
              Consult a vet over zoom, <br />
              from the comfort of your and your buddy's home.
            </div>
          </div>
        </div>

        

        <div className={"mb-20 flex justify-between items-center h-[60vh] ml-10"} style={{ backgroundImage: 'url("/assets/your_cat.jpg")', backgroundSize: 'cover', backgroundPosition: 'center' }}>
          <div className={"flex flex-col gap-5 flex-1"}>
            <div style={{ color: 'red', paddingLeft: '40px'}}>
              <h1 className={"text-2xl font-bold"}>
                We at WhiskerDoc are committed to help you and your pet <br />
                enjoy a stressless and healthy life.            
              </h1>
            </div>
          </div>
        </div>



        <div className={"mb-50 flex justify-center items-center h-[1vh] ml-10"} style={{ textAlign: 'center' }}>
          <div style={{ marginTop: '50px' }}>
            <div className="flex gap-4">
              <div className="bg-white rounded-lg shadow-md p-4 flex-1">
                <h3 className={"text-2xl font-bold text-black"}>
                  Something unusual with your pet?
                </h3>
                <div className="mt-2 text-black">
                  Check out our articles written by professionals, <br />
                  to help you understand your pet's health better.
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-4 flex-1">
                <h3 className={"text-2xl font-bold text-black"}>
                  How to make your pet's life better?
                </h3>
                <div className="mt-2 text-black">
                  Check out our blog, you'll learn new things. <br />
                  Additionally, you can help others by writing your own.
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-4 flex-1">
                <h3 className={"text-2xl font-bold text-black"}>
                  Choose a subscription plan that fits your needs.
                </h3>
                <div className="mt-2 text-black">
                  You can take 6-months or 12-months subscription plan, <br />
                  or no subscription at all. Choose what suits you best.
                </div>
              </div>
            </div>
          </div>
        </div>



        <div className={"mb-20 flex justify-between items-center h-[60vh] ml-10"} style={{ backgroundImage: 'url("/assets/vet.jpg")', backgroundSize: 'cover', backgroundPosition: 'center',  marginTop: '150px' }}>
          <div className={"flex flex-col gap-5 flex-1"}>
            <div style={{ color: 'red', paddingLeft: '40px'}}>
              <h1 className={"text-2xl font-bold"}>
                Are you a veterinarian? <br />
                WhiskerDoc is just the place.            
              </h1>
            </div>
          </div>
        </div>



        <div className={"flex justify-center items-center h-[1vh] ml-10"} style={{ textAlign: 'center' }}>
          <div style={{ marginTop: '50px' }}> {/* Add a margin to this wrapper */}
            <div className="flex gap-4">
              <div className="bg-white rounded-lg shadow-md p-4 flex-1">
                <h3 className={"text-2xl font-bold text-black"}>
                  Automation to help you focus on what matters.
                </h3>
                <div className="mt-2 text-black">
                  Use our automated prescription system, <br />
                  to save time and effort and to focus on the fur-babies.
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-4 flex-1">
                <h3 className={"text-2xl font-bold text-black"}>
                  Share your expertise with the world.
                </h3>
                <div className="mt-2 text-black">
                  Write articles on various pet syndromes, <br />
                  to help pet owners understand their pets better.
                </div>
              </div>
            </div>
          </div>
        </div>





        


      </main>
    </>
  );
}
