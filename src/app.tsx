import * as React from 'react';




const data: any = [
    {
        src: 'https://unsplash.it/800/300?image=1',
        title: 'title',
        content: 'content'
    },
    {
        src: 'https://unsplash.it/800/1300?image=22',
        title: 'title',
        content: 'content'
    },
    {
        src: 'https://unsplash.it/1800/1300?image=13',
        title: 'title',
        content: 'content'
    },
    {
        src: 'https://unsplash.it/800/600?image=8',
        title: 'title',
        content: 'content'
    },
    {
        src: 'https://unsplash.it/200/300?image=15',
        title: 'title',
        content: 'content'
    },
    {
        src: 'https://unsplash.it/800/300?image=6',
        title: 'title',
        content: 'content'
    },
     {
        src: 'https://unsplash.it/800/300?image=1',
        title: 'title',
        content: 'content'
    },
    {
        src: 'https://unsplash.it/800/1300?image=22',
        title: 'title',
        content: 'content'
    },
    {
        src: 'https://unsplash.it/1800/1300?image=13',
        title: 'title',
        content: 'content'
    },
    {
        src: 'https://unsplash.it/800/600?image=8',
        title: 'title',
        content: 'content'
    },
    {
        src: 'https://unsplash.it/200/300?image=15',
        title: 'title',
        content: 'content'
    },
    {
        src: 'https://unsplash.it/800/300?image=6',
        title: 'title',
        content: 'content'
    }

];

// ------------

const {
  Component,
  PropTypes
} = React;

const ZOOM_LEVEL = {
  MIN: 0,
  MAX: 4
};
const VISIBLE_INDICATORS_COUNT = 8;
const KEY_CODE = {
  LEFT: 37,
  RIGTH: 39
};
const OFFSET_DEFAULT = {
  x: 0,
  y: 0
};

interface Image {
    src: string;
    // Caption => {title} - {content}
    title?: string;
    content?: string;
}

interface Offset {
    x: number,
    y: number
}

interface ImageWrapperProps {
    image: Image;
    showIndex: boolean;
    index?: string;
}

class ImageWrapper extends Component<ImageWrapperProps, any> {
    private imageOuter: HTMLElement;
    private image: HTMLElement;
    private draggable: boolean;
    private src: any;
    private clientOffset: Offset;
    private offsetRange: Offset;

    private mounted: boolean;

    constructor(props: ImageWrapperProps, context: any) {
        super(props, context)
        this.state = {
            loading: false,
            onload: false,
            zoom: 0,
            offset: OFFSET_DEFAULT as Offset
        }
        this.draggable = false;
        this.offsetRange = OFFSET_DEFAULT;
        this.clientOffset = {
            x: undefined,
            y: undefined
        };
    }

    private loadImage(src: string) {
        this.state.loading = true;
        this.setState(this.state);

        this.src = new Image();
        this.src.src = src;
        this.src.onload = () => {
            if(!this.src) return;
            this.state.loading = false;
            this.state.onload = true;
            this.setState(this.state);
        }
        this.src.onerror = () => {
            if(!this.src) return;
            this.state.loading = false;
            this.state.onload = false;
            this.setState(this.state);
        }
    }

    private resetOffset() {
        this.state.offset = OFFSET_DEFAULT;
        this.setState(this.state);
    }

    private setOffsetRange() {
        const zoom: number = this.state.zoom;
        const dx: number = this.image.scrollWidth * (1 + zoom / 2) - this.imageOuter.clientWidth;
        const dy: number = this.image.scrollHeight * (1 + zoom / 2) - this.imageOuter.clientHeight;
        this.offsetRange = {
            x: Math.max(0, dx / 2),
            y: Math.max(0, dy / 2)
        }
    }

    private zoomIn() {
        if(!this.state.onload) return;
        this.state.zoom = Math.min(this.state.zoom + 1, ZOOM_LEVEL.MAX);
        this.setState(this.state);
        this.setOffsetRange();
    }

    private zoomOut() {
        if(!this.state.onload) return;
        this.state.zoom = Math.max(0, this.state.zoom - 1);
        this.setState(this.state);
        this.resetOffset();
        this.setOffsetRange();
    }

    private onMoveStart(e: any) {
        if(!this.offsetRange.x && !this.offsetRange.y) {
            return;
        }

        this.clientOffset = {
            x: e.clientX,
            y: e.clientY
        }
        this.draggable = true;
    }

    private onMove(e: any) {
        if(!e.clientX && !e.clientY || !this.draggable) {
            return;
        }

        const offset: Offset = {
            x: e.clientX - this.clientOffset.x,
            y: e.clientY - this.clientOffset.y,
        };

        this.clientOffset = {
            x: e.clientX,
            y: e.clientY
        };

        this.state.offset = {
            x: this.state.offset.x + offset.x,
            y: this.state.offset.y + offset.y,
        }
        this.setState(this.state);
    }

    private onMoveEnd(e: any) {
        if(!this.mounted) return;

        this.draggable = false;
        const offset: Offset = {
            x: Math.abs(this.state.offset.x),
            y: Math.abs(this.state.offset.y)
        }

        if(Math.abs(this.state.offset.x) >= this.offsetRange.x) {
            this.state.offset.x = this.state.offset.x < 0 ? Math.min(0, -(this.offsetRange.x)) : Math.max(0, this.offsetRange.x);
            this.setState(this.state);
        }

        if(Math.abs(this.state.offset.y) >= this.offsetRange.y) {
            this.state.offset.y = this.state.offset.y < 0 ? Math.min(0, -(this.offsetRange.y)) : Math.max(0, this.offsetRange.y);
            this.setState(this.state);
        }
    }

    componentWillReceiveProps(nextProps: any) {
        if(this.props.image.src != nextProps.image.src) {
            this.resetOffset();
            this.loadImage(nextProps.image.src);
            this.setState({
                zoom: 0
            });
        }
    }

    componentDidMount() {
        this.mounted = true;
        this.loadImage(this.props.image.src);
        window.addEventListener('resize', this.setOffsetRange.bind(this));
        document.documentElement.addEventListener("mouseup", this.onMoveEnd.bind(this));
    }

    componentWillUnmount() {
        this.mounted = false;
        if(!!this.src) {
            this.src = undefined;
        }
        window.removeEventListener('resize', this.setOffsetRange.bind(this));
        document.documentElement.removeEventListener("mouseup", this.onMoveEnd.bind(this));
    }

    render() {
        const {
            image,
            index,
            showIndex
        } = this.props;

        const {
            offset,
            zoom,
            loading
        } = this.state;

        const value: string = `translate3d(${offset.x}px, ${offset.y}px, 0px)`;
        const imageCls: string = `zoom-${zoom} image-outer ${this.draggable ? 'dragging' : ''}`;

        const caption: any = (
            <p className="caption">
                {image.title ? <span className="title">{image.title}</span> : null}
                {image.title && image.content ? <span>{` - `}</span> : null}
                {image.title ? <span className="content">{image.content}</span> : null}
            </p>
        );

        return (
            <div className="image-wrapper">
                <div
                    style={{ transform: value}}
                    ref={(component: any) => this.imageOuter = component}
                    className={imageCls}>
                    {loading ? (
                        <div className="spinner">
                            <div className="bounce"></div>
                        </div>
                    ) : <img
                            className="image"
                            ref={(component: any) => this.image = component}
                            src={image.src}
                            alt={image.title || ''}
                            draggable={false}
                            onDragStart={(e: any) => e.preventDefault()}
                            onMouseMove={this.onMove.bind(this)}
                            onMouseDown={this.onMoveStart.bind(this)}
                            onMouseUp={this.onMoveEnd.bind(this)}/>}
                </div>
                <div className="tool-bar">
                    {showIndex && <div className="index-indicator">{index}</div>}
                    {caption}
                    <div className="button-group">
                        <div className="zoom-out button"
                            onClick={this.zoomOut.bind(this)}>
                        </div>
                        <div className="zoom-in button"
                            onClick={this.zoomIn.bind(this)}>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

}

interface ImageViewerProps {
    images: Image[];
    activeIndex?: number;
    showIndex?: boolean;
    showPreview?: boolean;
    prefixCls?: string;
}

class ImageViewer extends Component<ImageViewerProps, any> {
    private container: HTMLElement;
    private mounted: boolean;

    static defaultProps = {
        prefixCls: 'react-image-viewer',
        className: '',
        showIndex: true,
        showPreview: true,
        activeIndex: 0,
    };

    static propTypes = {
        prefixCls: PropTypes.string,
        className: PropTypes.string,
        showIndex: PropTypes.bool,
        showPreview: PropTypes.bool,
        activeIndex: PropTypes.number,
    };

    constructor(props: ImageViewerProps) {
        super(props);
        this.state = {
            activeIndex: this.props.activeIndex
        }
    }

    private renderIndicators(list: Image[]) {
        const activeIndex: number = this.state.activeIndex;
        const ret: number = Math.round(VISIBLE_INDICATORS_COUNT / 2);
        const length: number = list.length;
        return list.map((item: Image, index: number) => {
            const isActive: boolean = activeIndex === index;
            const itemInvisible: boolean = length > VISIBLE_INDICATORS_COUNT && (index < Math.min(length - VISIBLE_INDICATORS_COUNT - 1, activeIndex - ret) || index > Math.max(activeIndex + ret, VISIBLE_INDICATORS_COUNT));

            const itemCls: string = `indicators-item ${isActive ? 'active' : ''} ${itemInvisible ? 'invisible' : ''} ${this.props.showPreview ? 'preview' : ''}`;

            return (
                <div
                    key={index}
                    className={itemCls}
                    onClick={this.itemControl.bind(this, index)}>
                    {this.props.showPreview && (
                        <div className="image" style={{ background: `url(${item.src})` }}></div>
                    )}
                </div>
            )

        })

    }

    private onPrev() {
        let index: number = (this.state.activeIndex + this.props.images.length - 1) % this.props.images.length;
        this.itemControl(index);
    }

    private onNext() {
        let index: number = (this.state.activeIndex + 1) % this.props.images.length;
        this.itemControl(index);
    }

    private itemControl(index: number) {
        if(index === this.state.activeIndex) return;
        this.state.activeIndex = index;
        this.setState(this.state);

    }

    private onKeyDown(e: any) {
        if(!this.mounted) return;
        e.stopPropagation();

        switch(e.which || e.keyCode) {
            case KEY_CODE.LEFT: this.onPrev();
            break;
            case KEY_CODE.RIGTH: this.onNext();
            break;
        }
    }

    componentDidMount() {
        this.mounted = true;
        document.documentElement.addEventListener("keydown", this.onKeyDown.bind(this));
    }

    componentWillUnmount() {
        this.mounted = false;
        document.documentElement.removeEventListener("keydown", this.onKeyDown.bind(this));
    }

    render() {
        const {
            images,
            showIndex,
            prefixCls
        } = this.props;
        const { activeIndex } = this.state;
        const indicatorVisible: boolean = images.length > 1;

        return (
            <div className={`react-image-viewer ${prefixCls}-image-viewer`}
                ref={(component: any) => this.container = component}>
                <ImageWrapper
                    showIndex={showIndex}
                    index={`${activeIndex + 1}/${images.length}`}
                    image={images[activeIndex]}/>
                {indicatorVisible ?
                    <div className="direction-control-button">
                        <div className="prev-button button"
                            onClick={this.onPrev.bind(this)}>
                            <div className="bar"></div>
                        </div>
                        <div className="next-button button"
                            onClick={this.onNext.bind(this)}>
                            <div className="bar"></div>
                        </div>
                        <div className="indicators">
                            {indicatorVisible && this.renderIndicators(images)}
                        </div>
                    </div>
                : null}
            </div>
        )
    }
}

interface ModalProps {
    images: Image[];
    prefixCls?: string;
    className?: string;
    // Bottom indicators preview
    showPreview?: boolean;
    // Toolbar index indicator
    showIndex?: boolean;
}

class Modal extends Component<ModalProps, any> {
    constructor(props: ModalProps) {
        super(props);
        this.state = {
            visible: false,
            activeIndex: undefined
        }
    }

    open(activeIndex?: number) {
        this.setState({
            visible: true,
            activeIndex: activeIndex || 0
        });
    }

    close() {
        this.setState({
            visible: false,
            activeIndex: undefined
        })
    }

    render() {
        const {
            images,
            prefixCls,
            className,
            showIndex,
            showPreview
        } = this.props;
        const { activeIndex } = this.state;

        return this.state.visible ? (
            <div className='modal'>
                <ImageViewer
                    showPreview={showPreview}
                    showIndex={showIndex}
                    prefixCls={prefixCls}
                    activeIndex={activeIndex}
                    images={images}/>
                <div className='close-button'
                    onClick={this.close.bind(this)}>
                </div>
            </div>
        ) : null;
    }
}



class Root extends Component<any, any> {
    private modal: Modal;
    render() {
        const { images } = this.props;
        return (
            <div className="image-gallery">
                {images.map((item: any, index: number) => (
                    <div className="image-item" key={index}
                        onClick={this.open.bind(this, index)}>
                        <div
                            className="image-inner"
                            style={{ background: `url(${item.src})`}}>
                        </div>
                    </div>
                ))}
                <Modal
                    images={images}
                    showIndex
                    showPreview
                    ref={(component: any) => this.modal = component}/>
            </div>
        )
    }
    open(index: number) {
        this.modal.open(index);
    }
}

export class App extends React.Component<undefined, undefined> {
  render() {
    return (  <Root images={data}/> );
  }
}
