import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { Clock,Zap} from "lucide-react";
import { cn } from "@/lib/utils";


const allPackages = [
  { price: "Ksh 5", duration: "30 Minutes", type: "Limited" },
  { price: "Ksh 10", duration: "2 Hours", type: "Limited" },
  { price: "Ksh 15", duration: "3 Hours", type: "Limited" },
  { price: "Ksh 20", duration: "1 Day", type: "Limited" },
  { price: "Ksh 25", duration: "1 Day 6 Hours", type: "Limited" },
  { price: "Ksh 40", duration: "2 Days", type: "Limited" },
  { price: "Ksh 50", duration: "3 Days", type: "Limited" },
  { price: "Ksh 100", duration: "1 Week", type: "Unlimited" },
  { price: "Ksh 300", duration: "2 weeks", type: "Unlimited" },
  { price: "Ksh 400", duration: "3 weeks", type: "Unlimited" },
  { price: "Ksh 800", duration: " 4 weeks", type: "unlimited" },
  { price: "Ksh 0", duration: "1 Month", type: "unlimited" },
];

const NetworkPackages: React.FC = () => {
  const [filter, setFilter] = useState<"All" | "Limited" | "Unlimited">("All");
  const [showAll, setShowAll] = useState(false);
  const [selectedPkg, setSelectedPkg] = useState<null | {
    price: string;
    duration: string;
  }>(null);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });

  const handlePurchase = async (pkg: { price: string; duration: string }) => {
    const phone = prompt("Enter your M-Pesa phone number (format 07 ...):");
    if (!phone) return;

    const res = await fetch("http://localhost:5000/api/mpesa/stk-push", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: parseInt(pkg.price.replace("Ksh ", "")),
        phone,
        description: `Purchase ${pkg.duration} package`,
      }),
    });

    const data = await res.json();
    if (data.success) {
      alert("STK Push sent to your phone. Complete the payment to activate.");
    } else {
      alert("Payment failed. Try again.");
    }
  };

  const filteredPackages =
    filter === "All"
      ? allPackages
      : allPackages.filter((pkg) => pkg.type === filter);

  const visiblePackages = showAll ? filteredPackages : filteredPackages.slice(0, 4);

  return (
 <div
  onMouseMove={(e) => setCursor({ x: e.clientX, y: e.clientY })}
  className="relative min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white px-4 py-10 overflow-hidden"
>
  {/* Cursor-reactive mesh */}
  <div
    className="absolute inset-0 pointer-events-none z-0 transition-all duration-300"
    style={{
      background: `radial-gradient(600px at ${cursor.x}px ${cursor.y}px, rgba(14,165,233,0.15), transparent 80%)`,
    }}
  />

  {/* Logo */}
  <div className="relative z-10 flex justify-center mb-6">
    <img
      src="/logo.jpeg"
      alt="AlphaTech Logo"
      className="w-20 h-20 object-contain rounded-full border-2 border-cyan-500 shadow-lg"
    />
  </div>

  {/* Welcome Section */}
  <div className="relative z-10 text-center mb-12 max-w-3xl mx-auto">
    <h1 className="md:text-2xl font-bold mb-3 tracking-tight">
      Welcome to <span className="text-cyan-400">AlphaTech Networks</span>
    </h1>
    <p className=" md:text-lg text-gray-300 flex md:pl-46 mx-auto">
      Affordable internet packages. Fast, flexible, and reliable.<Zap className="text-orange-600" />
    </p>
  </div>


      {/* Main Card */}
      <Card className="relative z-10 max-w-6xl mx-auto w-full bg-white/5 backdrop-blur-md border border-white/20 p-6 rounded-2xl shadow-lg">
        <CardHeader>
          <CardTitle className="text-white text-xl text-center mb-4">
            Choose a Network Package
          </CardTitle>
          <div className="flex justify-center gap-4 flex-wrap">
            {["All", "Limited", "Unlimited"].map((type) => (
              <Button
                key={type}
                variant={filter === type ? "default" : "outline"}
                onClick={() => {
                  setFilter(type as any);
                  setShowAll(false);
                }}
                className={cn(
                  "text-white border-white text-sm",
                  filter === type
                    ? "bg-cyan-600 hover:bg-cyan-700"
                    : "bg-transparent hover:bg-white/10"
                )}
              >
                {type}
              </Button>
            ))}
          </div>
        </CardHeader>

        {/* Package Cards */}
        <CardContent className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-6">
          {visiblePackages.map((pkg, idx) => (
            <Card
              key={idx}
              className="bg-white/10 border border-white/20 p-3 text-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-200"
            >
              <div className="flex flex-col items-start gap-2">
                <div className="flex gap-8">
                     <div className="text-sm text-cyan-400 font-medium">{pkg.price}</div>
                <div className="flex items-center gap-1 text-sm text-gray-300">
                  <Clock className="w-4 h-4 text-gray-400" />
                  {pkg.duration}
                </div>
                </div>
             
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="w-full mt-2"
                      onClick={() => setSelectedPkg(pkg)}
                    >
                      Purchase
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-white/10 backdrop-blur-md text-white max-w-sm mx-auto border border-gray-500 shadow-2xl rounded-xl">
                    <h2 className="text-xl font-semibold mb-2 text-center">
                      Confirm Purchase
                    </h2>
                    <p className="text-center text-sm">
                      Proceed to pay <strong>{selectedPkg?.price}</strong> for{" "}
                      <strong>{selectedPkg?.duration}</strong>?
                    </p>
                    <div className="flex justify-end gap-2 mt-4">
                      <Button variant="ghost">Cancel</Button>
                      <Button onClick={() => handlePurchase(selectedPkg!)}>
                        Confirm
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </Card>
          ))}
        </CardContent>

        {/* Load More / Show Less */}
        {filteredPackages.length > 4 && (
          <div className="flex justify-center mt-6">
            {!showAll ? (
              <Button variant="outline" onClick={() => setShowAll(true)}>
                Load More Packages
              </Button>
            ) : (
              <Button variant="ghost" onClick={() => setShowAll(false)}>
                Show Less Packages
              </Button>
            )}
          </div>
        )}
      </Card>
    </div>
  );
};

export default NetworkPackages;
