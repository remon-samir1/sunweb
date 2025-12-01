
"use client";
import React, { useState, useEffect, useRef } from "react";
import { Icon } from "@iconify/react";
import { gsap } from "gsap";
import Image from "next/image";
import ModalForm from "./FormModal";
import Axios from "../lib/Axios";

const PricingSection2 = () => {
  const [plans, setPlans] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedPlanId, setSelectedPlanId] = useState(null);

  const [modal, setModal] = useState(false);

  const contentRef = useRef(null);
  const listRef = useRef([]);

  // -----------------------------
  // Load API Data
  // -----------------------------
  useEffect(() => {
    Axios.get("/plans")
      .then((res) => {
        setPlans(res.data.data);
      })
      .catch((err) => console.log(err));
  }, []);

  // -----------------------------
  // GSAP Animations
  // -----------------------------
  useEffect(() => {
    if (!plans.length) return;

    gsap.fromTo(
      contentRef.current,
      { autoAlpha: 0, y: 30 },
      { autoAlpha: 1, y: 0, duration: 0.6, ease: "power3.out" }
    );

    gsap.fromTo(
      listRef.current,
      { autoAlpha: 0, x: -20 },
      {
        autoAlpha: 1,
        x: 0,
        duration: 0.4,
        stagger: 0.1,
        ease: "power3.out",
      }
    );
  }, [activeIndex, plans]);

  if (!plans.length)
    return (
      <p className="text-center text-white py-20">Loading pricing plans...</p>
    );

  const activePlan = plans[activeIndex];

  return (
    <div className="px-[5%] py-20 flex flex-col md:flex-row items-start gap-[5%]">
      {modal && <ModalForm modal={modal} selectedPlanId={selectedPlanId} setModal={setModal} />}

      {/* Left Buttons */}
      <div className="md:w-[40%]">
        <h3 className="text-[1.1rem] text-main font-semibold">Pricing plan</h3>
        <h4 className="text-white font-semibold mt-4 text-[2.5rem]">
          Pricing To Suit All Sizes Of Business
        </h4>
        <p className="text-base text-body py-8 border-b border-stroke">
          Choose the Right Plan for Your Business
        </p>

        {plans.map((p, index) => (
          <button
            key={p.id}
            onClick={() => setActiveIndex(index)}
            className={`text-[1.9rem] mt-6 block ${
              activeIndex === index
                ? "text-main font-bold border-l-4 pl-4 border-main"
                : "text-body font-medium"
            }`}
          >
            {p.title}
          </button>
        ))}
      </div>

      {/* Right Box */}
      <div className="md:w-[60%] w-full flex justify-end">
        <div className="rounded-[6rem] relative mt-4 md:mt-0 md:h-[39.5rem] h-[39.5rem] max-w-[540px] w-[90%]">
          <Image
            alt="pricing"
            src="/pricing.png"
            width="100"
            height="100"
            className="w-full rounded-[6rem] h-full object-cover"
          />

          <div
            ref={contentRef}
            className="md:w-[90%] w-full radius p-5 h-full border border-stroke bg-background2 absolute md:top-[10%] top-[15%] left-0 md:translate-x-[-20%] translate-x-[-15%] flex flex-col justify-between"
          >
            <div>
              <h3 className="text-white text-[1.3rem] font-medium mt-8">
                {activePlan.title}
              </h3>

              <p className="text-body text-base mt-4">
                {activePlan.description}
              </p>

              <p className="text-white text-[2rem] mt-4 font-bold">
                $ {activePlan.price}
              </p>

              <p className="mt-4 text-base text-body">Includes</p>

              {activePlan.includes.map((item, i) => (
                <div
                  key={i}
                  ref={(el) => (listRef.current[i] = el)}
                  className="flex mt-4 items-center gap-2 opacity-0"
                >
                  <div
                    className="flex justify-center items-center rounded-full"
                    style={{
                      backgroundImage:
                        "linear-gradient(90deg, #54EECC 6.34%, #9995CA 71.26%, #C161C9 108.64%)",
                      width: "24px",
                      height: "24px",
                    }}
                  >
                    <Icon
                      icon="material-symbols:done"
                      width="21"
                      height="21"
                      style={{ color: "#000" }}
                    />
                  </div>
                  <span className="text-[0.8rem] text-body">{item}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-center mt-2 mb-6">
              <button
            onClick={() => {
              setSelectedPlanId(activePlan.id);
              setModal(true);
            }}
            
                className="bg-main text-black px-8 py-3 rounded-full font-semibold hover:opacity-80 transition"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingSection2;
