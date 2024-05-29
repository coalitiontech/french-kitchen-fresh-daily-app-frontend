import { Button, Modal, Text, TextField, Collapsible, Icon, Link } from "@shopify/polaris";
import { useCallback, useEffect, useState } from "react";
import axiosInstance from '@/plugins/axios';
import IngredientGroupForm from "./IngredientGroup/IngredientGroupForm";
import {
    ChevronDownMinor,
    ChevronUpMinor
} from '@shopify/polaris-icons';
import IngredientsModal from "./IngredientsModal";

export default function IngredientGroupModal({
    onFieldsChange,
    clearValue,
    validationErrors,
    groupValues = [],
    ingredient_groups_ingredients = [],
    selectedIngredients = [],
    isEditing = false
}) {
    const [activeModal, setActiveModal] = useState(false);

    const [ingredientResponse, setIngredientResponse] = useState({});

    const [open, setOpen] = useState([]);

    const handleToggle = (index) => {
        setOpen((oldOpen) => {
            let backup = [...oldOpen]
            backup[index] = !open[index]
            return backup
        })
    };

    const toggleModal = useCallback(() => setActiveModal((activeModal) => !activeModal), []);

    const addGroupHandler = (newGroup, closeModal = false) => {
        onFieldsChange([newGroup], 'ingredient_groups')

        if (closeModal) {
            toggleModal()
        }
    }

    useEffect(() => {
        axiosInstance.get('/api/select/ingredients').then((response) => {
            setIngredientResponse(response)
        })
    }, [])

    useEffect(() => {
        if (open.length === 0) {
            let startOpen = []
            groupValues.map((item, index) => {
                startOpen[index] = true;
            })

            setOpen(startOpen);
        } else {
            let startOpen = [...open]
            groupValues.map((item, index) => {
                if(startOpen[index] === undefined) {
                    startOpen[index] = true;
                }
            })

            setOpen(startOpen);
        }

    }, [groupValues])

    useEffect(() => {
        if (!isEditing) {
            // setSelectedOptions([])
        }
    }, [clearValue])

    const activator = <div><Button onClick={toggleModal}>Add Group</Button></div>;

    return <div style={{ width: '100%', padding: '15px' }}>
        <h2 style={{ textAlign: 'center', fontSize: '20px', fontWeight: 'bold' }}>Ingredient Groups</h2>
        <div style={{ textAlign: 'right', marginBottom: '15px', marginTop: '10px' }}>
            <Modal
                activator={activator}
                open={activeModal}
                onClose={toggleModal}
                title="Add ingredient group to recipe"
                size='large'
            >
                <Modal.Section>
                    <IngredientGroupForm addGroup={addGroupHandler} />
                </Modal.Section>
            </Modal>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}>
            {
                groupValues.map((item, index) => {

                    // console.log('before ingredients modal', ingredient_groups_ingredients[index] )
                    return <div key={index}>
                        <div className="collapsible-ingredient-group" style={{ display: 'flex', justifyContent: 'space-between', padding: '0 15px' }}>
                            <Text variant="headingLg" as="h5">
                                Group: {item.name}
                            </Text>
                            <Link
                                onClick={() => (handleToggle(index))}
                                ariaExpanded={open[index]}
                                ariaControls="basic-collapsible"
                            >
                                <Icon source={open[index] ? ChevronUpMinor : ChevronDownMinor} />
                            </Link>
                        </div>
                        <div style={{ width: '100%' }}>
                            <Collapsible
                                open={open[index]}
                                id="basic-collapsible"
                                transition={{ duration: '500ms', timingFunction: 'ease-in-out' }}
                                expandOnPrint
                            >
                                <IngredientsModal
                                    onFieldsChange={onFieldsChange}
                                    clearValue={clearValue}
                                    validationErrors={validationErrors}
                                    isEditing={isEditing}
                                    groupIndex={index}
                                    response={ingredientResponse}
                                    editingValues={item['ingredients']}
                                    editingFields={item['ingredients']}
                                />
                            </Collapsible>
                        </div>

                    </div>

                })
            }
        </div>
    </div >
}