import { CodeSystem, Identifier } from "fhir/r4";
import IdentifierInput from "src/components/extensions/valueInputs/Identifier";
import Identifiers from "src/components/extensions/valueInputs/Identifiers";
import IdInput from "src/components/extensions/valueInputs/IdInput";

import Checkbox from "@helsenorge/designsystem-react/components/Checkbox";
import Input from "@helsenorge/designsystem-react/components/Input";
import Label from "@helsenorge/designsystem-react/components/Label";
import Select from "@helsenorge/designsystem-react/components/Select";

import { LanguageLocales } from "@helsenorge/designsystem-react";

import { useCodeSystemContext } from "../../context/useCodeSystemContext";

import style from "./code-system-concept-details.module.scss";

const CodeSystemDetails = (): React.JSX.Element => {
  const { newCodeSystem, setNewCodeSystem } = useCodeSystemContext();
  return (
    <div>
      <IdInput value={newCodeSystem.id} />
      <Input
        value={newCodeSystem.title}
        onChange={(event) =>
          setNewCodeSystem({ ...newCodeSystem, title: event.target.value })
        }
        label={<Label labelTexts={[{ text: "Title" }]} />}
      />
      <Input
        value={newCodeSystem.name}
        onChange={(event) =>
          setNewCodeSystem({ ...newCodeSystem, name: event.target.value })
        }
        label={<Label labelTexts={[{ text: "Teknisk-navn" }]} />}
      />
      <Input
        value={newCodeSystem.publisher}
        onChange={(event) =>
          setNewCodeSystem({ ...newCodeSystem, publisher: event.target.value })
        }
        label={<Label labelTexts={[{ text: "Publisher" }]} />}
      />
      <Input
        value={newCodeSystem.version}
        onChange={(event) =>
          setNewCodeSystem({ ...newCodeSystem, version: event.target.value })
        }
        label={<Label labelTexts={[{ text: "Version" }]} />}
      />
      <Input
        value={newCodeSystem.url}
        onChange={(event) =>
          setNewCodeSystem({ ...newCodeSystem, url: event.target.value })
        }
        label="Url"
      />
      <Input
        value={newCodeSystem.date}
        onChange={(event) =>
          setNewCodeSystem({ ...newCodeSystem, date: event.target.value })
        }
        label={<Label labelTexts={[{ text: "Date" }]} />}
      />
      <Input
        value={newCodeSystem.description}
        onChange={(event) =>
          setNewCodeSystem({
            ...newCodeSystem,
            description: event.target.value,
          })
        }
        label={<Label labelTexts={[{ text: "Description" }]} />}
      />
      <div className={style.checkboxCaseSensitive}>
        <Checkbox
          label={<Label labelTexts={[{ text: "Case Sensitive" }]} />}
          checked={newCodeSystem.caseSensitive}
          onChange={(event) =>
            setNewCodeSystem({
              ...newCodeSystem,
              caseSensitive: event.target.checked,
            })
          }
        />
      </div>

      <div className={style.identifierContainer}>
        <Identifiers />
      </div>
      <Select
        label={<Label labelTexts={[{ text: "status" }]} />}
        value={newCodeSystem.status || "draft"}
        onChange={(event) =>
          setNewCodeSystem({
            ...newCodeSystem,
            status: event.target.value as CodeSystem["status"],
          })
        }
      >
        <option value="draft">{"Draft"}</option>
        <option value="active">{"Active"}</option>
        <option value="retired">{"Retired"}</option>
        <option value="unknown">{"Unknown"}</option>
      </Select>
      <Select
        label={<Label labelTexts={[{ text: "content" }]} />}
        value={newCodeSystem.content || "not-present"}
        onChange={(event) =>
          setNewCodeSystem({
            ...newCodeSystem,
            content: event.target.value as CodeSystem["content"],
          })
        }
      >
        <option value="not-present">{"Not Present"}</option>
        <option value="example">{"Example"}</option>
        <option value="fragment">{"Fragment"}</option>
        <option value="complete">{"Complete"}</option>
        <option value="supplement">{"Supplement"}</option>
      </Select>
      <Select
        label={<Label labelTexts={[{ text: "Language" }]} />}
        value={newCodeSystem.language || LanguageLocales.NORWEGIAN}
        onChange={(event) =>
          setNewCodeSystem({
            ...newCodeSystem,
            language: event.target.value as CodeSystem["language"],
          })
        }
      >
        <option value={LanguageLocales.ENGLISH}>{"English"}</option>
        <option value={LanguageLocales.NORWEGIAN}>{"Norwegian "}</option>
        <option value={LanguageLocales.NORWEGIAN_NYNORSK}>{"Nynorsk"}</option>
        <option value={LanguageLocales.SAMI_NORTHERN}>{"Sami Northern"}</option>
      </Select>
    </div>
  );
};

export default CodeSystemDetails;
