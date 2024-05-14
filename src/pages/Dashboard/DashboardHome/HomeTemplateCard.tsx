import { Card } from "@/components/ui/card";
import { useState } from "react";
import { GetTemplate } from "./type";
import HomeTemplateModalDetail from "./HomeTemplateModalDetail";

type Props = {
  template: GetTemplate;
};

function HomeTemplateCard({ template }: Props) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <Card
        key={template.id}
        className="p-4 flex flex-col gap-3 cursor-pointer hover:bg-gray-900"
        onClick={() => setModalOpen(true)}
      >
        <h1 className="text-xl font-bold">{template.name}</h1>
      </Card>
      <HomeTemplateModalDetail
        template={template}
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
      />
    </>
  );
}

export default HomeTemplateCard;
