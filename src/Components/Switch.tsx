import Switch from "react-switch";

export default function StatusSwitch({ status, arrayKey, changeStatus, addClassName = true }) {
    return <div className={addClassName ? 'status-cell' : 'status-form'}>
        <Switch onChange={(value) => { changeStatus(value, arrayKey) }}
            offColor='#d3d3d3'
            onColor='#69e769'
            height={15}
            width={40}
            handleDiameter={20}
            boxShadow={'0 0 2px 1px #c3c3c3'}
            uncheckedIcon={false}
            checkedIcon={false}
            checked={Boolean(status)}
        />
    </div>
}