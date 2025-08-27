import { Card } from 'react-bootstrap';
import { ControlRegistry, coerceValueForKey } from '../ControlRegistry';

const AppearancePanel = ({ optionalKeys, draft, onChange }) => {
    const keys = optionalKeys.filter(k => ControlRegistry[k]);
    if (!keys.length) return null;

    return <>
        <Card>
            <Card.Body>
                <h4 className='mb-3 text-center'>Aesthetic Changes</h4>
                {keys.map((k) => {
                    const Cmp = ControlRegistry[k];
                    const val = draft[k];
                    return <Cmp
                        key={k}
                        value={val}
                        onChange={(v) => onChange(k, coerceValueForKey(k, v))}
                    />
                })}
            </Card.Body>
        </Card>
    </>
};

export default AppearancePanel;
