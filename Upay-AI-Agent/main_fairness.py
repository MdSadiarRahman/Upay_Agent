import json
from ai.fairness.fairness_checker import FairnessChecker

def main():
    print("--- Running AI Fairness Monitor ---")
    
    checker = FairnessChecker()
    dataset_path = "dataset/fairness_synthetic_data.csv"
    
    report = checker.evaluate_fairness(dataset_path)
    
    print("\n[ FAIRNESS REPORT ]")
    print(f"Fairness Score: {report['fairness_score']}/100")
    print(f"Status: {report['status']}")
    
    print("\n--- Group Performance Analysis ---")
    for group in report['group_performance']:
        print(f"\n{group['attribute'].upper()}:")
        for data in group['data']:
            print(f"  {data['group']:<15} | Avg Score: {data['average_score']:<5} | Accuracy: {data['accuracy']}%")
            
    if report['alerts']:
        print("\n--- BIAS ALERTS DETECTED ---")
        for alert in report['alerts']:
            print(f"[!] {alert['message']} (Diff: {alert['difference']})")
    else:
        print("\n[✓] No significant bias alerts detected.")
        
    print("\n--- Report Generation Complete ---")
    
if __name__ == "__main__":
    main()
