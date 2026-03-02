import React, { useState } from "react";
import { PricingCard } from "../../components/PricingCard/Card";
import { ComingSoonModal } from "../../components/CommingSoonModal/Modal";

const PricingScreen: React.FC = () => {
  const [openModal, setOpenModal] = useState<boolean>(false);

  return (
    <>
      {openModal && <ComingSoonModal setOpenModal={setOpenModal} />}
      <section className="flex flex-col max-w-5xl w-full items-center px-4 sm:px-6 lg:px-8 text-center">
      {/* <section className="flex flex-col max-w-5xl mx-auto items-center px-4 sm:px-6 lg:px-2 text-center w-full"> */}
        <div className="max-w-4xl">
          <h1
            className="text-5xl font-medium"
            style={{ fontFamily: "Google Sans" }}
          >
            Diseñado para mejorar el trabajo de las Empresas
          </h1>

          <p
            className="text-xl mt-3 w3xl"
            style={{ fontFamily: "Google Sans" }}
          >
            Aqui en BluEye Security nos centramos en la mejoras y automatizacion
            de SaaS cctv, teniendo una mejora e innovacion y proporcionando
            soluciones para los tecnicos como tu o tu equipo
          </p>
        </div>

        {/* Cards */}
        <section className="min-h-screen flex items-center justify-center py-20 text-black">
          <div className="max-w-full mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 place-items-stretch">
            <PricingCard
              titleCard="Inicial"
              description="La mejor opción para uso personal y para su próximo proyecto."
              pricingByMonth={29}
              checkList={[
                "Configuración individual",
                "Sin configuración ni cargos ocultos",
                "Tamaño del equipo: 1 dev",
                "Soporte Premium: 6 meses",
                "Actualizaciones gratuitas: 6 meses",
              ]}
              setOpenModal={setOpenModal}
            />
            <PricingCard
              titleCard="Pro"
              description="Relevante para múltiples usuarios, soporte extendido y premium."
              pricingByMonth={99}
              checkList={[
                "Configuración individual",
                "Sin configuración ni cargos ocultos",
                "Tamaño del equipo: 10 devs",
                "Soporte Premium: 24 meses",
                "Actualizaciones gratuitas: 24 meses",
              ]}
              setOpenModal={setOpenModal}
            />
            <PricingCard
              titleCard="Enterprice"
              description="Ideal para usos a gran escala y derechos de redistribución ampliados."
              pricingByMonth={299}
              checkList={[
                "Configuración individual",
                "Sin configuración ni cargos ocultos",
                "Tamaño del equipo: más de 100 devs",
                "Soporte Premium: 36 meses",
                "Actualizaciones gratuitas: 36 meses",
              ]}
              setOpenModal={setOpenModal}
            />
          </div>
        </section>
      </section>
    </>
  );
};

export default PricingScreen;
