import { Button, Label, TextField } from "@shopify/polaris";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Switch from "react-switch";

export default function IngredientGroupForm({ addGroup }) {
    const [groupValues, setGroupValues] = useState({
        name: '',
    });

    const addGroupHandler = () => {
        addGroup(groupValues, true)
    }

    return <div>
        <div>
            <TextField label='Name' value={groupValues.name} onChange={(value) => setGroupValues(prevValue => ({ ...prevValue, ...{ 'name': value } }))} />
        </div>
        <div style={{ marginTop: "10px", display: 'flex', justifyContent: 'end' }} >
            <Button onClick={addGroupHandler}>Create</Button>
        </div>
    </div>
}