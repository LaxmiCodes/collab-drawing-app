import React from 'react';
import Board from '../board/Board';
import './style.css';

class Container extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            color: "#000000", 
            size: "5" 
        };

        this.boardRef = React.createRef(); 
    }

    
    changeColor = (e) => {
        this.setState({
            color: e.target.value
        });
    };

    changeSize = (e) => {
        this.setState({
            size: e.target.value
        });
    };

    
    clearCanvas = () => {
        if (this.boardRef.current) {
            this.boardRef.current.clear(); 
        }
    };

    render() {
        return (
            <div className="container">
                <div className="tools-section">
                    <div className="color-picker-container">
                        Select Brush Color: &nbsp;
                        <input
                            type="color"
                            value={this.state.color}
                            onChange={this.changeColor}
                        />
                    </div>
                </div>
                <div className="brushsize-container">
                    Select Brush Size: &nbsp;
                    <select
                        value={this.state.size}
                        onChange={this.changeSize}
                    >
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="15">15</option>
                        <option value="20">20</option>
                        <option value="25">25</option>
                        <option value="30">30</option>
                    </select>
                </div>
                <div className="clear-container">
                    <button onClick={this.clearCanvas} className="clear-button">
                        Clear Canvas
                    </button>
                </div>

                <div className="board-container">
                    
                    <Board
                        ref={this.boardRef} 
                        color={this.state.color}
                        size={this.state.size}
                    />
                </div>
            </div>
        );
    }
}

export default Container;
