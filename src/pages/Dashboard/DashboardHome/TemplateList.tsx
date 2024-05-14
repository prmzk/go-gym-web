// import { Link } from "@tanstack/react-router";
import { useAPIQueryAuth } from "@/lib/api.hooks";
import NewTemplate from "./NewTemplate";
import { useAuth } from "@/lib/auth";
import { GetTemplate, TemplatesData } from "./type";
import HomeTemplateCard from "./HomeTemplateCard";

function TemplateList() {
  const { token } = useAuth();

  const { data, isFetching } = useAPIQueryAuth<TemplatesData>(
    "/gym/templates",
    {
      queryKey: ["templates", token],
    }
  );

  return (
    <div>
      <div className="sticky z-10 top-0 bg-background py-2 group">
        <h1 className="text-3xl font-bold mb-2">Templates</h1>
      </div>

      {isFetching && <div>Loading...</div>}
      {data && data.workouts.length === 0 && <div>No templates found</div>}
      <div className="grid gap-3 py-4">
        {data &&
          data.workouts.map((template: GetTemplate) => (
            <HomeTemplateCard key={template.id} template={template} />
          ))}
      </div>

      <NewTemplate />
    </div>
  );
}

export default TemplateList;
