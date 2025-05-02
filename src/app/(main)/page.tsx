"use client";
import Loader from "@/components/custom/loader";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  Thermometer,
  Droplet,
  Speaker,
  MapPin,
  Clock,
} from "lucide-react";
import moment from "moment";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [lastRecord, setLastRecord] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get("/api/auth", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setUser(res.data.user);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });

      // get the last record
      axios
        .get("/api/record/latest", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setLastRecord(res.data.record);
          console.log(res.data);
        })
        .catch((err) => {
          toast.error("Error getting last record");
        });
    } else {
      setLoading(false);
    }
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) {
      return "Good Morning";
    } else if (hour < 18) {
      return "Good Afternoon";
    } else {
      return "Good Evening";
    }
  };

  return (
    <div className="w-full h-full  flex justify-center lg:items-center overflow-hidden">
      <div className="w-[350px] h-[500px] backdrop-blur-xl rounded-xl shadow-2xl mt-[50px] lg:mt-0 flex flex-col justify-center items-center">
        {loading ? (
          <Loader />
        ) : (
          <div className="w-full h-full  flex flex-col justify-between items-center py-12 px-4 ">
            <h1 className="text-2xl text-accent-base font-bold">
              {getGreeting()}, {user?.firstName}
            </h1>

            {lastRecord ? (
              <div className="flex flex-col gap-3 w-full text-lg text-gray-700 text-center">
                <div className="flex items-center justify-center gap-2">
                  <MapPin size={24} />
                  <span>Location: {lastRecord.position}</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Thermometer size={24} />
                  <span>Temperature: {lastRecord.temperature}°C</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Droplet size={24} />
                  <span>Humidity: {lastRecord.humidity}%</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Speaker size={24} />
                  <span>Noise: {lastRecord.noice} dB</span>
                </div>
                <div className="flex items-center justify-center gap-2">
              
                  <span>
                    {moment(lastRecord.time).fromNow()} (
                    {moment(lastRecord.time).format("HH:mm, DD MMM YYYY")})
                  </span>
                </div>
              </div>
            ) : (
              <span className="text-white">No record found.</span>
            )}

            <Link
              href="/dashboard"
              className="w-[150px] h-[50px] bg-accent-base rounded-lg flex justify-center items-center text-white font-semibold text-md"
            >
              Dashboard
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
