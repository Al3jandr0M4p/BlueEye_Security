import React, { useState } from "react";
import { PricingCard } from "../../components/PricingCard/Card";
import { ComingSoonModal } from "../../modals/CommingSoonModal/Modal";

const PricingScreen: React.FC = () => {
  const [openModal, setOpenModal] = useState<boolean>(false);

  return (
    <>
      {openModal && <ComingSoonModal setOpenModal={setOpenModal} />}

      <section className="w-full">
        <div className="mx-auto max-w-6xl text-center">
          <h1
            className="text-4xl font-medium md:text-5xl"
            style={{ fontFamily: "Google Sans" }}
          >
            Diseñado para mejorar el trabajo de las Empresas
          </h1>

          <p
            className="mx-auto mt-3 max-w-4xl text-lg md:text-xl"
            style={{ fontFamily: "Google Sans" }}
          >
            Aqui en BluEye Security nos centramos en la mejoras y automatizacion
            de SaaS cctv, teniendo una mejora e innovacion y proporcionando
            soluciones para los tecnicos como tu o tu equipo
          </p>
        </div>

        <section className="mx-auto mt-10 max-w-7xl pb-8 text-black md:mt-12">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 2xl:grid-cols-3">
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
              titleCard="Enterprise"
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
