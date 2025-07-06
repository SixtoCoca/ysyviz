import { Card, Form } from 'react-bootstrap';
import { useState, useEffect, useMemo } from 'react';
import debounce from 'lodash.debounce';

const AdvancedSettings = ({ cfg, setCfg }) => {
    const [draft, setDraft] = useState(cfg);
    useEffect(() => setDraft(cfg), [cfg]);

    const debouncedCommit = useMemo(() => debounce(setCfg, 400), [setCfg]);

    useEffect(() => {
        return () => debouncedCommit.flush();
    }, [debouncedCommit]);
    const handleInput = (e) => {
        const { name, value } = e.target;
        setDraft(prev => ({ ...prev, [name]: value }));
        debouncedCommit({ ...draft, [name]: value });
        console.log(draft)
    };
    return (
        <Card>
            <Card.Body>
                <h4 className="mb-3 text-center">Chart Settings</h4>

                <Form.Label>Title</Form.Label>
                <Form.Control
                    type="text"
                    name="title"
                    value={draft.title}
                    placeholder="Enter chart title"
                    onChange={handleInput}
                />

                <Form.Label className="mt-3">Color</Form.Label>
                <Form.Control
                    type="color"
                    name="color"
                    value={draft.color}
                    onChange={handleInput}
                />
            </Card.Body>
        </Card>
    );
};

export default AdvancedSettings;
