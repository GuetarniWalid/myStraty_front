export default function constructTooltipLineChart(tooltipModel, dataAsset, darkMode) {
    // Tooltip Element
    let tooltipEl = document.getElementById('chartjs-tooltip');

    // Create element on first render
    if (!tooltipEl) {
      tooltipEl = document.createElement('div');
      tooltipEl.id = 'chartjs-tooltip';
      document.body.appendChild(tooltipEl);
    } else {
      tooltipEl.innerHTML = '';
    }

    // Hide if no tooltip
    if (tooltipModel.opacity === 0) {
      tooltipEl.style.opacity = 0;
      return;
    }

    // Set caret Position
    tooltipEl.classList.remove('above', 'below', 'no-transform');
    if (tooltipModel.yAlign) {
      tooltipEl.classList.add(tooltipModel.yAlign);
    } else {
      tooltipEl.classList.add('no-transform');
    }

    // Set title
    const titleToFormatData = new Date(tooltipModel.title).toLocaleString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    const titleStyle = `
    font-family: "Hind", sans-serif; 
    color: ${darkMode ? '#7db7dc' : '#3276EB'};
    margin-bottom: 15;
    font-weight: bold;
    `;
    const title = `<p style='${titleStyle}'>${titleToFormatData}</p>`;
    tooltipEl.innerHTML += title;

    // Set body
    const unit = this._chartInstance.chart.options.scales.xAxes[0].time.unit;
    function createBodyElement(legendBackground, currency, legendName, sign) {
      const pStyle = `
      font-family: "Open Sans", sans-serif; 
      font-size: 10px;
      color: ${darkMode ? '#f3f1ff' : '#8497B8'};
      margin-bottom: 15;
      display: flex;
      justify-content: space-between
      `;
      const legendStyle = `
      display: inline-block;
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background-color: ${legendBackground}
      `;
      const legend = `<span style='${legendStyle}'></span>`;
      const leftSpan = `<span>${legend} ${legendName}</span>`;

      const priceFormated =
        unit === 'day'
          ? String(dataAsset[currency].valuesByDay[tooltipModel.dataPoints[0].index]).substring(0, 7)
          : String(dataAsset[currency].valuesByMonth[tooltipModel.dataPoints[0].index]).substring(0, 7);

      const element = `<p style='${pStyle}'>${leftSpan}<span>${sign}${priceFormated}</span></p>`;
      tooltipEl.innerHTML += element;
    }
    //eur
    createBodyElement('rgba(123,158,113,1)', 'eur', 'euro', '€ ');
    //btc
    createBodyElement('rgba(255,146,1,1)', 'btc', 'bitcoin', '₿ ');
    //eth
    createBodyElement('rgba(140,140,140,1)', 'eth', 'ethereum', 'Ξ ');

    // `this` will be the overall tooltip
    var position = this._chart.canvas.getBoundingClientRect();

    // Display, position
    tooltipEl.style.opacity = 1;
    tooltipEl.style.background = darkMode ? '#2e2e3d' : '#fff';
    tooltipEl.style.borderRadius = '5px';
    tooltipEl.style.minWidth = '180px';
    tooltipEl.style.position = 'absolute';
    tooltipEl.style.left = position.left + window.pageXOffset + tooltipModel.caretX + 'px';
    tooltipEl.style.top = position.top + window.pageYOffset + tooltipModel.caretY + 'px';
    tooltipEl.style.padding = tooltipModel.yPadding + 'px ' + tooltipModel.xPadding + 'px';
    tooltipEl.style.pointerEvents = 'none';
    tooltipEl.style.transition = 'all 0.2s';

    //setting of tooltip position
    switch (tooltipModel.xAlign) {
      case 'center':
        switch (tooltipModel.yAlign) {
          case 'center':
            tooltipEl.style.transform = 'translate(-55%, -55%)';
            break;
          case 'right':
            tooltipEl.style.transform = 'translate(-55%, -105%)';
            break;
          default:
            tooltipEl.style.transform = 'translate(-55%, 5%)';
        }
        break;
      case 'right':
        switch (tooltipModel.yAlign) {
          case 'center':
            tooltipEl.style.transform = 'translate(-105%, -55%)';
            break;
          case 'right':
            tooltipEl.style.transform = 'translate(-105%, -105%)';
            break;
          default:
            tooltipEl.style.transform = 'translate(-105%, 5%)';
        }
        break;
      default:
        switch (tooltipModel.yAlign) {
          case 'center':
            tooltipEl.style.transform = 'translate(5%, -55%)';
            break;
          case 'right':
            tooltipEl.style.transform = 'translate(5%, -105%)';
            break;
          default:
            tooltipEl.style.transform = 'translate(5%, 5%)';
        }
    }
  }